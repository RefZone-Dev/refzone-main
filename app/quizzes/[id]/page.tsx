import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { QuizPlayer } from "@/components/quiz-player"

export default async function QuizDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch quiz details
  const { data: quiz } = await supabase.from("quizzes").select("*").eq("id", id).single()

  if (!quiz) {
    redirect("/quizzes")
  }

  // Fetch quiz questions
  const { data: questions } = await supabase.from("quiz_questions").select("*").eq("quiz_id", id).order("order_index")

  return <QuizPlayer quiz={quiz} questions={questions || []} userId={user.id} />
}
