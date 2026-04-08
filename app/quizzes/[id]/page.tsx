import { requireAuth } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { redirect } from "next/navigation"
import { QuizPlayer } from "@/components/quiz-player"

export default async function QuizDetailPage({ params }: { params: { id: string } }) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    redirect("/auth/login")
  }
  const supabase = createServiceClient()
  const { id } = await params

  // Fetch quiz details
  const { data: quiz } = await supabase.from("quizzes").select("*").eq("id", id).single()

  if (!quiz) {
    redirect("/quizzes")
  }

  // Fetch quiz questions
  const { data: questions } = await supabase.from("quiz_questions").select("*").eq("quiz_id", id).order("order_index")

  return <QuizPlayer quiz={quiz} questions={questions || []} userId={userId} />
}
