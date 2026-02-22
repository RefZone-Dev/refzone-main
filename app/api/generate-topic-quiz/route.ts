import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"

const deepseek = createOpenAI({
  apiKey: "sk-29fe8c9737fc4dde86e97d1621d24586",
  baseURL: "https://api.deepseek.com/v1",
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { topic, lawCategory, lawSection } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    // Get the laws document for accuracy
    const { data: configData } = await supabase
      .from("admin_config")
      .select("config_value")
      .eq("config_key", "laws_of_the_game_document")
      .single()

    const lawsDocument = configData?.config_value || ""

    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      system: lawsDocument
        ? `You are a football referee instructor creating a focused quiz. Reference this Laws of the Game document:\n\n${lawsDocument}`
        : "You are a football referee instructor with comprehensive knowledge of IFAB Laws of the Game 2025/26.",
      prompt: `Create a focused 5-question quiz specifically about "${topic}" ${lawCategory ? `(${lawCategory})` : ""}.

The questions should help a referee who is struggling with this area improve their understanding.

IMPORTANT: Return ONLY valid JSON in this exact format:
{
  "title": "Quiz title mentioning ${topic} (max 60 chars)",
  "description": "Brief description focused on ${topic}",
  "difficulty": "medium",
  "questions": [
    {
      "question_text": "Question about ${topic}",
      "question_type": "multiple_choice",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct_answer": "Must match one option exactly",
      "explanation": "Clear explanation citing specific Laws",
      "points_value": 5,
      "law_category": "${lawCategory || "Law 12"}",
      "law_section": "${lawSection || topic}"
    }
  ]
}

Create exactly 5 questions that specifically target ${topic}. Each question should have a clear, educational explanation.`,
    })

    let cleanedText = text.trim()
    if (cleanedText.startsWith("```json")) cleanedText = cleanedText.slice(7)
    if (cleanedText.startsWith("```")) cleanedText = cleanedText.slice(3)
    if (cleanedText.endsWith("```")) cleanedText = cleanedText.slice(0, -3)
    cleanedText = cleanedText.trim()

    const jsonStartIndex = cleanedText.indexOf("{")
    const jsonEndIndex = cleanedText.lastIndexOf("}")
    if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
      cleanedText = cleanedText.substring(jsonStartIndex, jsonEndIndex + 1)
    }

    const quizData = JSON.parse(cleanedText)

    // Create the quiz
    const { data: newQuiz, error: quizError } = await supabase
      .from("quizzes")
      .insert({
        title: quizData.title,
        description: quizData.description,
        difficulty: quizData.difficulty || "medium",
        is_active: true,
      })
      .select()
      .single()

    if (quizError) {
      console.error("[v0] Quiz insert error:", quizError)
      return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 })
    }

    // Insert questions
    const questionsToInsert = quizData.questions.map((q: any, index: number) => ({
      quiz_id: newQuiz.id,
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      points_value: q.points_value || 5,
      order_index: index,
      law_category: q.law_category || lawCategory,
      law_section: q.law_section || lawSection,
    }))

    const { error: questionsError } = await supabase
      .from("quiz_questions")
      .insert(questionsToInsert)

    if (questionsError) {
      // Cleanup on failure
      await supabase.from("quizzes").delete().eq("id", newQuiz.id)
      console.error("[v0] Questions insert error:", questionsError)
      return NextResponse.json({ error: "Failed to create questions" }, { status: 500 })
    }

    return NextResponse.json({ success: true, quiz: newQuiz })
  } catch (error) {
    console.error("[v0] Topic quiz generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate quiz", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
