import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"
import { NextResponse } from "next/server"
import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"

const deepseek = createOpenAI({
  apiKey: "sk-29fe8c9737fc4dde86e97d1621d24586",
  baseURL: "https://api.deepseek.com",
})

export async function POST(request: Request) {
  try {
    const authClient = await createClient()
    const { data: { user } } = await authClient.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = user.id
    const body = await request.json()
    const { quantity = 1, category = "" } = body

    const supabase = createServiceClient()

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single()

    if (profileError || !profile?.is_admin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

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
      .select("id, title, difficulty, description")
      .order("created_at", { ascending: false })
      .limit(50)

    let existingQuizzesRef = ""
    if (existingQuizzes && existingQuizzes.length > 0) {
      const quizIds = existingQuizzes.map((q) => q.id)
      const { data: existingQuestions } = await supabase
        .from("quiz_questions")
        .select("quiz_id, question_text, law_category, correct_answer")
        .in("quiz_id", quizIds)

      existingQuizzesRef = "\n\nEXISTING QUIZZES (use as reference to avoid duplicates):\n"
      existingQuizzes.forEach((q, i) => {
        const quizQuestions = existingQuestions?.filter((qu) => qu.quiz_id === q.id) || []
        existingQuizzesRef += `${i + 1}. "${q.title}" (${q.difficulty})\n`
        existingQuizzesRef += `   Description: ${q.description || "N/A"}\n`
        quizQuestions.slice(0, 3).forEach((qu) => {
          existingQuizzesRef += `   - Q: ${qu.question_text.substring(0, 80)}... (${qu.law_category}, Answer: ${qu.correct_answer})\n`
        })
        existingQuizzesRef += "\n"
      })
    }

    const categoryFilter = category ? `Focus on ${category}.` : "Cover various law categories."
    const quantityNote = quantity > 1 ? `Generate ${quantity} unique quizzes.` : ""

    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      system: lawsDocument
        ? `You are a football referee instructor. You MUST reference this complete Laws of the Game document for accuracy:\n\n${lawsDocument}`
        : "You are a football referee instructor with knowledge of IFAB Laws of the Game.",
      prompt: `${quizPrompt}${existingQuizzesRef}

${quantityNote} ${categoryFilter}

IMPORTANT: Return ONLY valid JSON in this exact format:
${quantity > 1 ? `{
  "quizzes": [
    {
      "title": "Quiz title (max 60 chars)",
      "description": "Brief quiz description",
      "difficulty": "easy" | "medium" | "hard",
      "questions": [
        {
          "question_text": "The question",
          "question_type": "multiple_choice" | "true_false",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correct_answer": "Must match one option exactly",
          "explanation": "Why this is correct",
          "points_value": 5,
          "law_category": "Law 1" through "Law 17",
          "law_section": "Section name"
        }
      ]
    }
  ]
}` : `{
  "title": "Quiz title (max 60 chars)",
  "description": "Brief quiz description",
  "difficulty": "easy" | "medium" | "hard",
  "questions": [
    {
      "question_text": "The question",
      "question_type": "multiple_choice" | "true_false",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct_answer": "Must match one option exactly",
      "explanation": "Why this is correct",
      "points_value": 5,
      "law_category": "Law 1" through "Law 17",
      "law_section": "Section name"
    }
  ]
}`}`,
    })

    let cleanedText = text.trim()

    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.slice(7)
    }
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.slice(3)
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.slice(0, -3)
    }
    cleanedText = cleanedText.trim()

    const jsonStartIndex = cleanedText.indexOf("{")
    const jsonEndIndex = cleanedText.lastIndexOf("}")

    if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonStartIndex < jsonEndIndex) {
      cleanedText = cleanedText.substring(jsonStartIndex, jsonEndIndex + 1)
    }

    let quizData
    try {
      quizData = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError)
      console.error("[v0] Cleaned text:", cleanedText.substring(0, 500))
      return NextResponse.json(
        {
          error: "Generation failed",
          details: "AI response was not valid JSON. Please try again.",
        },
        { status: 500 },
      )
    }
    
    // Handle both single quiz and multiple quizzes format
    const quizzesToProcess = quizData.quizzes ? quizData.quizzes : [quizData]
    
    const createdQuizzes = []
    let totalQuestions = 0

    for (const quiz of quizzesToProcess) {
      const { data: newQuiz, error: quizError } = await supabase
        .from("quizzes")
        .insert({
          title: quiz.title,
          description: quiz.description,
          difficulty: quiz.difficulty,
          is_active: true,
        })
        .select()
        .single()

      if (quizError) {
        console.error("Failed to insert quiz:", quizError)
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
        console.error("Failed to insert questions:", questionsError)
        await supabase.from("quizzes").delete().eq("id", newQuiz.id)
        continue
      }

      createdQuizzes.push(newQuiz)
      totalQuestions += questionsToInsert.length
    }

    return NextResponse.json({ 
      success: true, 
      quizzesCreated: createdQuizzes.length,
      questionsCreated: totalQuestions,
      quizzes: createdQuizzes 
    })
  } catch (error) {
    console.error("Quiz generation error:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error("Error details:", { message: errorMessage, stack: errorStack })

    return NextResponse.json(
      {
        error: "Generation failed",
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}
