import { requireAuth } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    let userId: string
    try {
      userId = await requireAuth()
    } catch (authErr) {
      console.error("[quiz-submit] Auth failed:", authErr)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const supabase = createServiceClient()

    const body = await request.json()
    const { quizId, answers, timeElapsed, questions } = body as {
      quizId: string
      answers: Record<string, string[]>
      timeElapsed: number
      questions: Array<{
        id: string
        correct_answer: string[] | string
        points_value: number
        law_category?: string
        law_section?: string
      }>
    }

    if (!quizId || !answers || !questions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Score the answers
    let totalScore = 0
    let totalPossible = 0
    const questionResults: Array<{
      questionId: string
      isCorrect: boolean
      pointsEarned: number
      lawCategory: string
      lawSection: string | null
    }> = []

    questions.forEach((question) => {
      totalPossible += question.points_value
      const userAnswer = answers[question.id] || []
      const correctAnswer = normalizeAnswer(question.correct_answer)

      const isCorrect =
        userAnswer.length === correctAnswer.length &&
        userAnswer.every((ans) => correctAnswer.includes(ans)) &&
        correctAnswer.every((ans) => userAnswer.includes(ans))

      const pointsEarned = isCorrect ? question.points_value : 0
      totalScore += pointsEarned

      console.log(`[quiz-submit] Q:${question.id} user:[${userAnswer}] correct:[${correctAnswer}] match:${isCorrect} law:${question.law_category}`)

      questionResults.push({
        questionId: question.id,
        isCorrect,
        pointsEarned,
        lawCategory: question.law_category || null,
        lawSection: question.law_section || null,
      })
    })

    const percentage = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0

    // Insert quiz attempt — try with time_taken_seconds, fall back without
    let attempt: any = null
    let attemptError: any = null

    const attemptData: Record<string, any> = {
      user_id: userId,
      quiz_id: quizId,
      score: totalScore,
      total_possible: totalPossible,
      percentage,
    }

    // Try with time_taken_seconds first
    const result1 = await supabase
      .from("quiz_attempts")
      .insert({ ...attemptData, time_taken_seconds: timeElapsed })
      .select()
      .single()

    if (result1.error) {
      // Retry without time_taken_seconds
      const result2 = await supabase
        .from("quiz_attempts")
        .insert(attemptData)
        .select()
        .single()
      attempt = result2.data
      attemptError = result2.error
    } else {
      attempt = result1.data
    }

    if (attemptError || !attempt) {
      console.error("[quiz-submit] Insert quiz_attempts failed:", attemptError)
      return NextResponse.json(
        { error: "Failed to save quiz attempt", details: attemptError?.message || "Unknown error" },
        { status: 500 }
      )
    }

    // Insert quiz answers
    const answerRecords = questionResults.map((result) => ({
      attempt_id: attempt.id,
      question_id: result.questionId,
      user_answer: answers[result.questionId] || [],
      is_correct: result.isCorrect,
      points_earned: result.pointsEarned,
    }))

    // Try inserting quiz_answers — fall back to fewer columns if schema mismatch
    let answersSaved = false
    const { error: answersError } = await supabase.from("quiz_answers").insert(answerRecords)
    if (answersError) {
      console.error("[quiz-submit] quiz_answers insert failed:", answersError.message)
      // Try without points_earned
      const withoutPoints = answerRecords.map(({ points_earned, ...rest }: any) => rest)
      const { error: retry1 } = await supabase.from("quiz_answers").insert(withoutPoints)
      if (retry1) {
        console.error("[quiz-submit] quiz_answers retry1 failed:", retry1.message)
        // Try minimal columns only
        const minimal = answerRecords.map((r: any) => ({
          attempt_id: r.attempt_id,
          question_id: r.question_id,
          user_answer: r.user_answer,
          is_correct: r.is_correct,
        }))
        const { error: retry2 } = await supabase.from("quiz_answers").insert(minimal)
        if (retry2) console.error("[quiz-submit] quiz_answers minimal insert failed:", retry2.message)
        else { console.log("[quiz-submit] quiz_answers saved (minimal):", minimal.length); answersSaved = true }
      } else { console.log("[quiz-submit] quiz_answers saved (no points_earned):", withoutPoints.length); answersSaved = true }
    } else { console.log("[quiz-submit] quiz_answers saved:", answerRecords.length); answersSaved = true }

    // Update law performance for each question (skip if no law category)
    for (const result of questionResults) {
      if (!result.lawCategory) continue

      const { data: existing } = await supabase
        .from("user_law_performance")
        .select("*")
        .eq("user_id", userId)
        .eq("law_category", result.lawCategory)
        .eq("law_section", result.lawSection || "")
        .single()

      if (existing) {
        const newTotal = existing.total_attempts + 1
        const newCorrect = existing.correct_attempts + (result.isCorrect ? 1 : 0)
        const newAccuracy = (newCorrect / newTotal) * 100

        await supabase
          .from("user_law_performance")
          .update({
            total_attempts: newTotal,
            correct_attempts: newCorrect,
            accuracy: newAccuracy,
            last_attempt_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)
      } else {
        const { error: insertErr } = await supabase.from("user_law_performance").insert({
          user_id: userId,
          law_category: result.lawCategory,
          law_section: result.lawSection || "",
          total_attempts: 1,
          correct_attempts: result.isCorrect ? 1 : 0,
          accuracy: result.isCorrect ? 100 : 0,
        })
        if (insertErr) console.error("[quiz-submit] law_performance insert failed:", insertErr.message)
      }
    }

    // Update streak
    const today = new Date().toISOString().split("T")[0]
    const { data: profile } = await supabase
      .from("profiles")
      .select("current_streak, longest_streak, last_activity_date, total_points")
      .eq("id", userId)
      .single()

    if (profile) {
      let newStreak = profile.current_streak || 0
      const lastDate = profile.last_activity_date

      if (lastDate === today) {
        // Already active today, keep streak
      } else {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split("T")[0]

        if (lastDate === yesterdayStr) {
          newStreak += 1
        } else {
          newStreak = 1
        }
      }

      const longestStreak = Math.max(newStreak, profile.longest_streak || 0)

      await supabase
        .from("profiles")
        .update({
          total_points: profile.total_points + totalScore,
          current_streak: newStreak,
          longest_streak: longestStreak,
          last_activity_date: today,
        })
        .eq("id", userId)

      // Update daily activity log
      const { data: existingLog } = await supabase
        .from("daily_activity_log")
        .select("id, quizzes_completed")
        .eq("user_id", userId)
        .eq("activity_date", today)
        .single()

      if (existingLog) {
        await supabase
          .from("daily_activity_log")
          .update({ quizzes_completed: (existingLog.quizzes_completed || 0) + 1 })
          .eq("id", existingLog.id)
      } else {
        await supabase.from("daily_activity_log").insert({
          user_id: userId,
          activity_date: today,
          quizzes_completed: 1,
          scenarios_completed: 0,
        })
      }
    }

    return NextResponse.json({
      success: true,
      score: totalScore,
      totalPossible,
      percentage: Math.round(percentage),
      questionResults: questionResults.map((r) => ({
        questionId: r.questionId,
        isCorrect: r.isCorrect,
        pointsEarned: r.pointsEarned,
      })),
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit quiz", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

function normalizeAnswer(answer: string[] | string): string[] {
  if (Array.isArray(answer)) return answer
  try {
    const parsed = JSON.parse(answer)
    return Array.isArray(parsed) ? parsed : [answer]
  } catch {
    return [answer]
  }
}
