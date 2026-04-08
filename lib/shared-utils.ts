import { createClient } from "@/lib/supabase/client"

export function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "easy":
      return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
    case "medium":
      return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800"
    case "hard":
      return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export async function updateLawPerformance(
  userId: string,
  lawCategory: string,
  lawSection: string | null,
  isCorrect: boolean
) {
  const supabase = createClient()

  const { data: existing } = await supabase
    .from("user_law_performance")
    .select("*")
    .eq("user_id", userId)
    .eq("law_category", lawCategory)
    .eq("law_section", lawSection || "")
    .single()

  if (existing) {
    const newTotal = existing.total_attempts + 1
    const newCorrect = existing.correct_attempts + (isCorrect ? 1 : 0)
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
    await supabase.from("user_law_performance").insert({
      user_id: userId,
      law_category: lawCategory,
      law_section: lawSection || "",
      total_attempts: 1,
      correct_attempts: isCorrect ? 1 : 0,
      accuracy: isCorrect ? 100 : 0,
    })
  }
}

export async function updateDailyStreak(userId: string) {
  const supabase = createClient()
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (!profile) return { newStreak: 1, longestStreak: 1, streakContinued: false }

  const today = new Date().toISOString().split("T")[0]
  const lastActivity = profile.last_activity_date
  let newStreak = profile.current_streak || 0
  let longestStreak = profile.longest_streak || 0
  let streakContinued = false

  if (lastActivity) {
    const lastDate = new Date(lastActivity)
    const todayDate = new Date(today)
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      newStreak += 1
      streakContinued = true
    } else if (diffDays > 1) {
      newStreak = 1
    }
  } else {
    newStreak = 1
  }

  if (newStreak > longestStreak) {
    longestStreak = newStreak
  }

  return { newStreak, longestStreak, streakContinued, profile, today }
}

export async function updateDailyActivityLog(
  userId: string,
  today: string,
  type: "scenario" | "quiz"
) {
  const supabase = createClient()

  const { data: existingLog } = await supabase
    .from("daily_activity_log")
    .select("*")
    .eq("user_id", userId)
    .eq("activity_date", today)
    .single()

  if (existingLog) {
    const field = type === "scenario" ? "scenarios_completed" : "quizzes_completed"
    await supabase
      .from("daily_activity_log")
      .update({
        [field]: existingLog[field] + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingLog.id)
  } else {
    await supabase.from("daily_activity_log").insert({
      user_id: userId,
      activity_date: today,
      scenarios_completed: type === "scenario" ? 1 : 0,
      quizzes_completed: type === "quiz" ? 1 : 0,
    })
  }
}
