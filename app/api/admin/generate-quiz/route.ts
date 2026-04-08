import { requireAdmin } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { NextResponse } from "next/server"
import { generateText } from "ai"
import { parseAIJsonResponse } from "@/lib/parse-ai-json"
import { getModel } from "@/lib/ai-model"

// Generate a single quiz via AI
async function generateSingleQuiz(
  quizPrompt: string,
  lawsDocument: string,
  categoryFilter: string,
  existingQuizzesRef: string,
  previousTitles: string[],
  lengthPref: string,
) {
  const lengths: Record<string, { count: number; label: string; time: number }> = {
    short: { count: 5, label: "Short", time: 10 },
    standard: { count: 10, label: "Standard", time: 15 },
    extended: { count: 15, label: "Extended", time: 20 },
  }
  const allLengths = Object.values(lengths)
  const chosenLength = lengths[lengthPref] || allLengths[Math.floor(Math.random() * allLengths.length)]

  const avoidNote = previousTitles.length > 0
    ? `\nDo NOT reuse these titles or topics: ${previousTitles.join(", ")}`
    : ""

  const result = await generateText({
    model: getModel(),
    system: lawsDocument
      ? `You are a football referee instructor. Reference this Laws of the Game document for accuracy:\n\n${lawsDocument}`
      : "You are a football referee instructor with knowledge of IFAB Laws of the Game.",
    maxOutputTokens: 8192,
    temperature: 0.8,
    prompt: `${quizPrompt}${existingQuizzesRef}${avoidNote}

${categoryFilter}

Generate EXACTLY ${chosenLength.count} questions (${chosenLength.label} quiz). Return ONLY valid JSON, no other text.
Mix question_type between "multiple_choice", "true_false", "multi_select". Keep explanations to 1-2 sentences.

CRITICAL: Every question MUST have a specific "law_category" (e.g. "Law 11", "Law 12", "Law 14") and a specific "law_section" (e.g. "Offside Position", "Fouls and Misconduct", "The Penalty Kick"). Never use "General" — always cite the exact Law number and section.

JSON format:
{"title":"...","description":"...","difficulty":"easy|medium|hard","time_limit_minutes":${chosenLength.time},"questions":[{"question_text":"...","question_type":"multiple_choice","options":["A","B","C","D"],"correct_answer":["A"],"explanation":"...","points_value":5,"law_category":"Law 12","law_section":"Fouls and Misconduct"}]}

EXACTLY ${chosenLength.count} questions. Complete the JSON fully.`,
  })

  return parseAIJsonResponse(result.text)
}

export async function POST(request: Request) {
  try {
    await requireAdmin()

    let quantity = 1
    let category = ""
    let lengthPref = "random"
    try {
      const body = await request.json()
      quantity = Math.min(body.quantity || 1, 10) // Cap at 10
      category = body.category || ""
      lengthPref = body.length || "random"
    } catch {
      // No body provided, use defaults
    }

    const supabase = createServiceClient()

    const { data: configData } = await supabase
      .from("admin_config")
      .select("config_key, config_value")
      .in("config_key", ["weekly_quiz_prompt", "laws_of_the_game_document"])

    const quizPrompt =
      configData?.find((c) => c.config_key === "weekly_quiz_prompt")?.config_value ||
      "Generate a football refereeing quiz."
    const lawsDocument = configData?.find((c) => c.config_key === "laws_of_the_game_document")?.config_value || ""

    const { data: existingQuizzes } = await supabase
      .from("quizzes")
      .select("title")
      .order("created_at", { ascending: false })
      .limit(20)

    const existingQuizzesRef = existingQuizzes && existingQuizzes.length > 0
      ? `\n\nAvoid duplicating these existing quiz topics: ${existingQuizzes.map((q) => q.title).join(", ")}`
      : ""

    const categoryFilter = category ? `Focus on ${category}.` : "Cover various law categories."

    // Generate each quiz as a separate AI request in parallel
    const generationPromises = []
    const previousTitles: string[] = []

    for (let i = 0; i < quantity; i++) {
      // Stagger slightly to encourage variety — each request knows about previous titles
      generationPromises.push(
        generateSingleQuiz(quizPrompt, lawsDocument, categoryFilter, existingQuizzesRef, [...previousTitles], lengthPref)
          .then((data) => {
            const title = (data as any)?.title
            if (title) previousTitles.push(title)
            return { success: true, data }
          })
          .catch((err) => ({
            success: false,
            error: err instanceof Error ? err.message : String(err),
          }))
      )
    }

    const results = await Promise.all(generationPromises)

    // Insert all successful quizzes into the database
    const createdQuizzes = []
    let totalQuestions = 0
    const skippedQuizzes: string[] = []

    for (const result of results) {
      if (!result.success) {
        skippedQuizzes.push(`AI generation failed: ${(result as any).error}`)
        continue
      }

      const quiz = (result as any).data as any
      if (!quiz?.questions || quiz.questions.length === 0) {
        skippedQuizzes.push(`Quiz "${quiz?.title || "unknown"}" had no questions`)
        continue
      }

      // Calculate time limit based on actual question count
      const questionCount = quiz.questions.length
      const timeLimit = questionCount <= 5 ? 10 : questionCount <= 10 ? 15 : 20

      const { data: newQuiz, error: quizError } = await supabase
        .from("quizzes")
        .insert({
          title: quiz.title,
          description: quiz.description,
          difficulty: quiz.difficulty,
          time_limit_minutes: timeLimit,
          is_active: true,
        })
        .select()
        .single()

      if (quizError) {
        skippedQuizzes.push(`Quiz "${quiz.title}" failed to insert: ${quizError.message}`)
        continue
      }

      const questionsToInsert = quiz.questions.map((q: any, index: number) => ({
        quiz_id: newQuiz.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        points_value: q.points_value || q.points || 5,
        order_index: index,
        law_category: q.law_category || null,
        law_section: q.law_section || null,
      }))

      const { error: questionsError } = await supabase.from("quiz_questions").insert(questionsToInsert)

      if (questionsError) {
        skippedQuizzes.push(`Quiz "${quiz.title}" questions failed: ${questionsError.message}`)
        await supabase.from("quizzes").delete().eq("id", newQuiz.id)
        continue
      }

      createdQuizzes.push(newQuiz)
      totalQuestions += questionsToInsert.length
    }

    if (createdQuizzes.length === 0 && skippedQuizzes.length > 0) {
      return NextResponse.json({
        error: "Failed to create any quizzes",
        details: skippedQuizzes.join("\n\n"),
        skippedQuizzes,
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      quizzesCreated: createdQuizzes.length,
      questionsCreated: totalQuestions,
      quizzes: createdQuizzes,
      ...(skippedQuizzes.length > 0 && { warnings: skippedQuizzes }),
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: "Generation failed", details: errorMessage },
      { status: 500 },
    )
  }
}
