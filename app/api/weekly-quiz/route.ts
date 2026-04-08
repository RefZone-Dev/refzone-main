import { createServiceClient } from "@/lib/supabase/service"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// Public API — no auth required
// Returns the latest active quiz with questions (no correct answers)
export async function GET() {
  const supabase = createServiceClient()

  // Get the most recently created active quiz
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("id, title, description, difficulty, time_limit_minutes, created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (quizError || !quiz) {
    return NextResponse.json({ error: "No weekly quiz available" }, { status: 404 })
  }

  // Get questions without correct answers
  const { data: questions, error: questionsError } = await supabase
    .from("quiz_questions")
    .select("id, question_text, question_type, options, order_index, law_category, law_section, points_value")
    .eq("quiz_id", quiz.id)
    .order("order_index", { ascending: true })

  if (questionsError) {
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
  }

  return NextResponse.json({ quiz, questions })
}

// Public API — submit answers and get results (no auth, no saving)
export async function POST(request: Request) {
  const supabase = createServiceClient()

  const body = await request.json()
  const { quizId, answers } = body as {
    quizId: string
    answers: Record<string, string[]>
  }

  if (!quizId || !answers) {
    return NextResponse.json({ error: "Missing quizId or answers" }, { status: 400 })
  }

  // Fetch the quiz questions with correct answers
  const { data: questions, error } = await supabase
    .from("quiz_questions")
    .select("id, question_text, question_type, options, correct_answer, explanation, points_value, order_index, law_category, law_section")
    .eq("quiz_id", quizId)
    .order("order_index", { ascending: true })

  if (error || !questions) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
  }

  // Score the answers
  let score = 0
  let totalPossible = 0
  const results = questions.map((q) => {
    totalPossible += q.points_value

    const userAnswer = answers[q.id] || []
    const correctAnswer = normalizeAnswer(q.correct_answer)
    const isCorrect =
      userAnswer.length === correctAnswer.length &&
      userAnswer.every((a: string) => correctAnswer.includes(a))

    if (isCorrect) score += q.points_value

    return {
      questionId: q.id,
      questionText: q.question_text,
      options: q.options,
      userAnswer,
      correctAnswer,
      isCorrect,
      explanation: q.explanation,
      lawCategory: q.law_category,
      lawSection: q.law_section,
    }
  })

  const percentage = totalPossible > 0 ? Math.round((score / totalPossible) * 100) : 0

  return NextResponse.json({
    score,
    totalPossible,
    percentage,
    correctCount: results.filter((r) => r.isCorrect).length,
    totalQuestions: results.length,
    results,
  })
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
