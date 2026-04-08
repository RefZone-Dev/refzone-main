import { requireAuth, ensureProfile } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { redirect } from "next/navigation"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    redirect("/auth/login")
  }
  const supabase = createServiceClient()

  // Ensure profile exists (creates one if needed)
  const profile = await ensureProfile(userId)

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  // Run queries in parallel
  const [scenarioResult, quizResult, recentScenariosResult, allQuizAttemptsResult] = await Promise.all([
    // Scenario responses (all time)
    supabase.from("scenario_responses").select("is_correct").eq("user_id", userId),
    // Quiz attempts (all time) — need score, total_possible, and id
    supabase.from("quiz_attempts").select("*").eq("user_id", userId),
    // Recent scenario responses for 7-day chart
    supabase
      .from("scenario_responses")
      .select("is_correct, created_at")
      .eq("user_id", userId)
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: true }),
    // All quiz attempts (for chart + law breakdown)
    supabase
      .from("quiz_attempts")
      .select("*")
      .eq("user_id", userId),
  ])

  const scenarioResponses = scenarioResult.data || []
  const quizAttempts = quizResult.data || []
  const recentScenarios = recentScenariosResult.data || []
  const allQuizAttempts = allQuizAttemptsResult.data || []

  // Compute law performance from all available data sources
  // Use fractional correct counts to avoid rounding to 0
  const lawMap: Record<string, { correct: number; total: number; section: string }> = {}

  if (allQuizAttempts.length > 0) {
    const attemptIds = allQuizAttempts.map((a: any) => a.id)
    const quizIds = [...new Set(allQuizAttempts.map((a: any) => a.quiz_id))]

    const [answersRes, questionsRes] = await Promise.all([
      supabase.from("quiz_answers").select("attempt_id, question_id, is_correct").in("attempt_id", attemptIds),
      supabase.from("quiz_questions").select("id, quiz_id, law_category, law_section").in("quiz_id", quizIds),
    ])

    const answers = answersRes.data || []
    const questions = questionsRes.data || []
    const qMap = new Map(questions.map((q) => [q.id, q]))
    const attemptIdsWithAnswers = new Set(answers.map((a) => a.attempt_id))

    // Source 1: quiz_answers — accurate per-question data
    for (const a of answers) {
      const q = qMap.get(a.question_id)
      if (!q?.law_category) continue
      if (!lawMap[q.law_category]) lawMap[q.law_category] = { correct: 0, total: 0, section: q.law_section || "" }
      lawMap[q.law_category].total += 1
      if (a.is_correct) lawMap[q.law_category].correct += 1
    }

    // Source 2: For attempts WITHOUT quiz_answers, distribute score proportionally
    // Keep fractional correct counts — only round at display time
    for (const attempt of allQuizAttempts) {
      if (attemptIdsWithAnswers.has((attempt as any).id)) continue

      const quizQuestions = questions.filter((q) => q.quiz_id === (attempt as any).quiz_id && q.law_category)
      if (quizQuestions.length === 0) continue

      const score = (attempt as any).score || 0
      const totalPossible = (attempt as any).total_possible || 0
      if (totalPossible === 0) continue

      const lawCounts: Record<string, { count: number; section: string }> = {}
      for (const q of quizQuestions) {
        if (!lawCounts[q.law_category]) lawCounts[q.law_category] = { count: 0, section: q.law_section || "" }
        lawCounts[q.law_category].count += 1
      }

      const correctRatio = score / totalPossible

      for (const [law, info] of Object.entries(lawCounts)) {
        if (!lawMap[law]) lawMap[law] = { correct: 0, total: 0, section: info.section }
        // Keep fractional — e.g. 1 question * 0.42 ratio = 0.42 correct (not rounded to 0)
        lawMap[law].total += info.count
        lawMap[law].correct += info.count * correctRatio
      }
    }
  }

  const lawPerformance = Object.entries(lawMap)
    .filter(([_, s]) => s.total > 0)
    .map(([law, s]) => ({
      law_category: law,
      law_section: s.section,
      accuracy: Math.round((s.correct / s.total) * 100),
      total_attempts: s.total,
    }))
    .sort((a, b) => a.accuracy - b.accuracy)

  // Convert quiz attempts to individual response-like entries for the chart
  const recentQuizEntries: Array<{ is_correct: boolean; created_at: string }> = []
  for (const attempt of allQuizAttempts) {
    // Use whichever timestamp exists
    const timestamp = (attempt as any).completed_at || (attempt as any).created_at || new Date().toISOString()
    const attemptDate = new Date(timestamp)
    if (attemptDate < sevenDaysAgo) continue // Skip older than 7 days

    // Expand attempt into individual question results based on score
    const totalQ = Math.max(1, Math.round((attempt as any).total_possible / 5))
    const correctQ = Math.round((attempt as any).score / 5)
    for (let i = 0; i < correctQ; i++) {
      recentQuizEntries.push({ is_correct: true, created_at: timestamp })
    }
    for (let i = 0; i < Math.max(0, totalQ - correctQ); i++) {
      recentQuizEntries.push({ is_correct: false, created_at: timestamp })
    }
  }

  // Combine scenario + quiz data for 7-day chart
  const recentResponses = [...recentScenarios, ...recentQuizEntries].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  const scenarioAccuracy =
    scenarioResponses.length > 0
      ? Math.round((scenarioResponses.filter((r) => r.is_correct).length / scenarioResponses.length) * 100)
      : 0

  const totalQuizScore = quizAttempts.reduce((acc, q) => acc + (q.score || 0), 0)
  const totalQuizPossible = quizAttempts.reduce((acc, q) => acc + (q.total_possible || 0), 0)
  const quizAccuracy = totalQuizPossible > 0 ? Math.round((totalQuizScore / totalQuizPossible) * 100) : 0

  // Fetch activity log for streak calendar (last 35 days)
  const thirtyFiveDaysAgo = new Date()
  thirtyFiveDaysAgo.setDate(thirtyFiveDaysAgo.getDate() - 35)
  const { data: activityLog } = await supabase
    .from("daily_activity_log")
    .select("activity_date, quizzes_completed, scenarios_completed")
    .eq("user_id", userId)
    .gte("activity_date", thirtyFiveDaysAgo.toISOString().split("T")[0])

  const activeDays = (activityLog || []).map((d: any) => d.activity_date)

  return (
    <DashboardContent
      profile={profile}
      todayActivity={null}
      scenarioAccuracy={scenarioAccuracy}
      quizAccuracy={quizAccuracy}
      forumPosts={[]}
      lawPerformance={lawPerformance}
      recentResponses={recentResponses}
      totalScenarios={scenarioResponses.length}
      totalQuizzes={quizAttempts.length}
      activeDays={activeDays}
    />
  )
}
