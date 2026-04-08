import { requireAuth } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const userId = await requireAuth()
    const supabase = createServiceClient()

    const body = await request.json()
    const { scenarioId, userDecision, isCorrect, timeElapsed, pointsEarned, lawCategory, lawSection } = body as {
      scenarioId: string
      userDecision: string
      isCorrect: boolean
      timeElapsed: number
      pointsEarned: number
      lawCategory?: string
      lawSection?: string
    }

    if (!scenarioId || !userDecision) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert scenario response — try with time fields, fall back without
    const responseData: Record<string, any> = {
      user_id: userId,
      scenario_id: scenarioId,
      user_decision: userDecision,
      is_correct: isCorrect,
      points_earned: pointsEarned,
    }

    let responseError = (await supabase.from("scenario_responses").insert({ ...responseData, time_taken_seconds: timeElapsed })).error
    if (responseError) {
      responseError = (await supabase.from("scenario_responses").insert(responseData)).error
    }

    if (responseError) {
      return NextResponse.json({ error: "Failed to save response", details: responseError.message }, { status: 500 })
    }

    // Update law performance (skip if no specific law category)
    if (!lawCategory) {
      // Skip to streak update
    } else {
    const law = lawCategory
    const { data: existing } = await supabase
      .from("user_law_performance")
      .select("*")
      .eq("user_id", userId)
      .eq("law_category", law)
      .eq("law_section", lawSection || "")
      .single()

    if (existing) {
      const newTotal = existing.total_attempts + 1
      const newCorrect = existing.correct_attempts + (isCorrect ? 1 : 0)
      await supabase
        .from("user_law_performance")
        .update({
          total_attempts: newTotal,
          correct_attempts: newCorrect,
          accuracy: (newCorrect / newTotal) * 100,
          last_attempt_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
    } else {
      await supabase.from("user_law_performance").insert({
        user_id: userId,
        law_category: law,
        law_section: lawSection || "",
        total_attempts: 1,
        correct_attempts: isCorrect ? 1 : 0,
        accuracy: isCorrect ? 100 : 0,
      })
    }
    } // end lawCategory check

    // Update streak
    const today = new Date().toISOString().split("T")[0]
    const { data: profile } = await supabase
      .from("profiles")
      .select("current_streak, longest_streak, last_activity_date, total_points, scenario_streak, longest_scenario_streak")
      .eq("id", userId)
      .single()

    let newScenarioStreak = 0
    let longestScenarioStreak = 0

    if (profile) {
      let newStreak = profile.current_streak || 0
      const lastDate = profile.last_activity_date

      if (lastDate !== today) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        newStreak = lastDate === yesterday.toISOString().split("T")[0] ? newStreak + 1 : 1
      }

      const longestStreak = Math.max(newStreak, profile.longest_streak || 0)

      // Scenario streak
      newScenarioStreak = isCorrect ? (profile.scenario_streak || 0) + 1 : 0
      longestScenarioStreak = Math.max(newScenarioStreak, profile.longest_scenario_streak || 0)

      await supabase
        .from("profiles")
        .update({
          total_points: profile.total_points + pointsEarned,
          current_streak: newStreak,
          longest_streak: longestStreak,
          scenario_streak: newScenarioStreak,
          longest_scenario_streak: longestScenarioStreak,
          last_activity_date: today,
        })
        .eq("id", userId)

      // Daily activity log
      const { data: existingLog } = await supabase
        .from("daily_activity_log")
        .select("id, scenarios_completed")
        .eq("user_id", userId)
        .eq("activity_date", today)
        .single()

      if (existingLog) {
        await supabase
          .from("daily_activity_log")
          .update({ scenarios_completed: (existingLog.scenarios_completed || 0) + 1 })
          .eq("id", existingLog.id)
      } else {
        await supabase.from("daily_activity_log").insert({
          user_id: userId,
          activity_date: today,
          quizzes_completed: 0,
          scenarios_completed: 1,
        })
      }
    }

    return NextResponse.json({
      success: true,
      scenarioStreak: newScenarioStreak,
      longestScenarioStreak,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
