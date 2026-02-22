import { createServiceClient } from "@/lib/supabase/service"
import { NextResponse } from "next/server"
import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"

const deepseek = createOpenAI({
  apiKey: "sk-29fe8c9737fc4dde86e97d1621d24586",
  baseURL: "https://api.deepseek.com/v1",
})

export const dynamic = "force-dynamic"

// This endpoint can be called by any external cron service (e.g. Hostinger cron job, cron-job.org)
// Example: curl -H "Authorization: Bearer YOUR_SECRET" https://app.refzone.com.au/api/cron/generate-weekly-quiz
export async function GET(request: Request) {
  // Verify the request with a shared secret
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createServiceClient()

  try {
    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      prompt: `Generate a football/soccer refereeing quiz with 5 questions to test Laws of the Game knowledge based on the IFAB Laws of the Game 2025/26.

CRITICAL: All questions, answers, and explanations MUST be based on and accurately reflect the official IFAB Laws of the Game 2025/26, including:
- Law 11: Offside
- Law 12: Fouls and Misconduct
- Law 13: Free Kicks
- Law 14: The Penalty Kick
- Law 5: The Referee
- And all other relevant Laws

Return ONLY valid JSON (no markdown, no code blocks) in this exact format:
{
  "title": "Quiz title (max 60 chars)",
  "description": "Brief description of what the quiz covers",
  "difficulty": "easy" | "medium" | "hard",
  "time_limit_minutes": 15 | 20 | 25,
  "questions": [
    {
      "question_text": "The question text",
      "question_type": "multiple_choice" | "true_false" | "multi_select",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct_answer": ["Correct option(s)"],
      "explanation": "Why this is correct with direct reference to specific IFAB Laws of the Game 2025/26 (cite specific Law numbers)",
      "points_value": 5 | 10
    }
  ]
}

Requirements:
- Create exactly 5 questions
- Use a mix of question types (multiple_choice, true_false, multi_select)
- Base all questions on actual IFAB Laws of the Game 2025/26
- Include clear explanations citing the relevant Law number and using direct quotes where possible
- Make questions educational, realistic, and strictly compliant with IFAB Laws
- Questions should test understanding of the Laws, not trick questions`,
    })

    // Parse the AI response
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

    // Deactivate old quizzes (keep only last 4 weeks active)
    const fourWeeksAgo = new Date()
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)

    await supabase.from("quizzes").update({ is_active: false }).lt("created_at", fourWeeksAgo.toISOString())

    // Insert the new quiz
    const { data: newQuiz, error: quizError } = await supabase
      .from("quizzes")
      .insert({
        title: quizData.title,
        description: quizData.description,
        difficulty: quizData.difficulty,
        time_limit_minutes: quizData.time_limit_minutes,
        is_active: true,
      })
      .select()
      .single()

    if (quizError) {
      console.error("Error inserting quiz:", quizError)
      return NextResponse.json({ error: "Failed to insert quiz" }, { status: 500 })
    }

    // Insert the quiz questions
    const questions = quizData.questions.map((q: any, index: number) => ({
      quiz_id: newQuiz.id,
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      points_value: q.points_value,
      order_index: index + 1,
    }))

    const { error: questionsError } = await supabase.from("quiz_questions").insert(questions)

    if (questionsError) {
      console.error("Error inserting questions:", questionsError)
      await supabase.from("quizzes").delete().eq("id", newQuiz.id)
      return NextResponse.json({ error: "Failed to insert questions" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      quiz: newQuiz,
      questionsCount: questions.length,
    })
  } catch (error) {
    console.error("Error generating weekly quiz:", error)
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 })
  }
}
