import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch profile first (needed for redirect check)
  const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // If profile doesn't exist yet, it will be auto-created by the trigger on next login
  // For now, just show the dashboard with empty data
  if (!profile) {
    console.log("[v0] No profile found for user, will be auto-created:", profileError)
    // Don't redirect - just show dashboard with minimal data
  }

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  // Run queries in parallel for tables that exist
  const [scenarioResult, quizResult, recentResult] = await Promise.all([
    // Scenario responses
    supabase.from("scenario_responses").select("is_correct").eq("user_id", user.id),
    // Quiz attempts
    supabase.from("quiz_attempts").select("score, total_possible, percentage").eq("user_id", user.id),
    // Recent scenario responses for chart
    supabase
      .from("scenario_responses")
      .select("is_correct, created_at")
      .eq("user_id", user.id)
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: true }),
  ])

  const scenarioResponses = scenarioResult.data || []
  const quizAttempts = quizResult.data || []
  const recentResponses = recentResult.data || []

  const scenarioAccuracy =
    scenarioResponses.length > 0
      ? Math.round((scenarioResponses.filter((r) => r.is_correct).length / scenarioResponses.length) * 100)
      : 0

  const quizAccuracy =
    quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((acc, q) => acc + (q.percentage || 0), 0) / quizAttempts.length)
      : 0

  return (
    <DashboardContent
      profile={profile || {
        id: user.id,
        display_name: user.email?.split('@')[0] || 'User',
        experience_level: 'beginner',
        total_points: 0,
        current_streak: 0,
        longest_streak: 0,
        last_activity_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }}
      todayActivity={null}
      scenarioAccuracy={scenarioAccuracy}
      quizAccuracy={quizAccuracy}
      forumPosts={[]}
      lawPerformance={[]}
      recentResponses={recentResponses}
      totalScenarios={scenarioResponses.length}
      totalQuizzes={quizAttempts.length}
    />
  )
}

