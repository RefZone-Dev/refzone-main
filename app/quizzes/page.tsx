import { requireAuth } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { redirect } from "next/navigation"
import { checkFeatureClosure } from "@/lib/feature-closures"
import { FeatureClosure } from "@/components/ui/feature-closure"
import { QuizzesClient } from "./quizzes-client"

export default async function QuizzesPage() {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    redirect("/auth/login")
  }
  const supabase = createServiceClient()

  const closure = await checkFeatureClosure('quizzes')
  if (closure) {
    return <FeatureClosure closure={closure} />
  }

  const [quizzesResult, attemptsResult] = await Promise.all([
    supabase
      .from("quizzes")
      .select("*, quiz_questions(id, law_category)")
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
    supabase.from("quiz_attempts").select("quiz_id, percentage").eq("user_id", userId),
  ])

  const quizzes = quizzesResult.data || []
  const attempts = attemptsResult.data || []

  // Build best scores map
  const bestScores: Record<string, number> = {}
  attempts.forEach((attempt) => {
    const current = bestScores[attempt.quiz_id]
    if (current === undefined || attempt.percentage > current) {
      bestScores[attempt.quiz_id] = Math.round(attempt.percentage)
    }
  })

  // Enrich quizzes with question count and law categories
  const enrichedQuizzes = quizzes.map((quiz) => {
    const questions: any[] = (quiz as any).quiz_questions || []
    const questionCount = questions.length

    // Extract unique law categories
    const lawCategories = [...new Set(
      questions.map((q: any) => q.law_category).filter(Boolean) as string[]
    )]

    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
      time_limit_minutes: quiz.time_limit_minutes,
      created_at: quiz.created_at,
      questionCount,
      lawCategories,
    }
  })

  return <QuizzesClient quizzes={enrichedQuizzes} bestScores={bestScores} />
}
