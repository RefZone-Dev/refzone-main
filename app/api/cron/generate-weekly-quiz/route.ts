import { createServiceClient } from "@/lib/supabase/service"
import { NextResponse } from "next/server"
import { generateText } from "ai"
import { parseAIJsonResponse } from "@/lib/parse-ai-json"
import { getModel } from "@/lib/ai-model"

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
      model: getModel(),
      maxOutputTokens: 8192,
      prompt: `Generate a football/soccer refereeing quiz with EXACTLY 15 questions to test Laws of the Game knowledge based on the IFAB Laws of the Game 2025/26. This is the Weekly Challenge quiz — a comprehensive test covering a broad range of Laws.

CRITICAL: All questions, answers, and explanations MUST be based on and accurately reflect the official IFAB Laws of the Game 2025/26, including:
- Law 11: Offside
- Law 12: Fouls and Misconduct
- Law 13: Free Kicks
- Law 14: The Penalty Kick
- Law 5: The Referee
- And all other relevant Laws

Return ONLY valid JSON (no markdown, no code blocks) in this exact format:
{
  "title": "Weekly Challenge — [topic/theme]",
  "description": "Brief description of what the quiz covers",
  "difficulty": "medium",
  "time_limit_minutes": 20,
  "questions": [
    {
      "question_text": "The question text",
      "question_type": "multiple_choice" | "true_false" | "multi_select",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct_answer": ["Correct option(s)"],
      "explanation": "Why this is correct with direct reference to specific IFAB Laws of the Game 2025/26 (cite specific Law numbers)",
      "points_value": 5 | 10,
      "law_category": "Law X",
      "law_section": "Section name"
    }
  ]
}

Requirements:
- Create exactly 15 questions
- Use a mix of question types (multiple_choice, true_false, multi_select)
- Cover at least 5 different Laws across the 15 questions
- Base all questions on actual IFAB Laws of the Game 2025/26
- Include clear explanations citing the relevant Law number and using direct quotes where possible
- Make questions educational, realistic, and strictly compliant with IFAB Laws
- Questions should test understanding of the Laws, not trick questions
- CRITICAL: Every question MUST have a specific law_category (e.g. "Law 12") and a specific law_section (e.g. "Fouls and Misconduct"). Never use "General" — always cite the exact IFAB Law number and section name.`,
    })

    const quizData = parseAIJsonResponse(text) as any

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
        time_limit_minutes: quizData.questions?.length <= 5 ? 10 : quizData.questions?.length <= 10 ? 15 : 20,
        is_active: true,
      })
      .select()
      .single()

    if (quizError) {
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
      law_category: q.law_category || null,
      law_section: q.law_section || null,
    }))

    const { error: questionsError } = await supabase.from("quiz_questions").insert(questions)

    if (questionsError) {
      await supabase.from("quizzes").delete().eq("id", newQuiz.id)
      return NextResponse.json({ error: "Failed to insert questions" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      quiz: newQuiz,
      questionsCount: questions.length,
    })
  } catch {
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 })
  }
}
