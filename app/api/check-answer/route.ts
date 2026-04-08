import { generateText } from "ai"
import { NextResponse } from "next/server"
import { parseAIJsonResponse } from "@/lib/parse-ai-json"
import { getModel } from "@/lib/ai-model"

export async function POST(req: Request) {
  try {
    const { userAnswer, correctAnswer, questionContext } = await req.json()

    const { text } = await generateText({
      model: getModel(),
      prompt: `You are a football referee answer checker for RefZone. You must evaluate answers based on the IFAB Laws of the Game 2025/26.

Return your answer as strict JSON only — no markdown, no explanations, no text before or after the JSON.

The JSON must have exactly this shape:
{
  "isCorrect": true or false,
  "confidence": number between 0-100
}

Constraints:
- Compare the user's answer to the correct answer semantically based on IFAB Laws of the Game 2025/26.
- Mark correct if the user's decision matches the correct decision according to the Laws, even with different wording.
- Focus on the core call (card type, restart, foul decision) as defined in the Laws of the Game.
- Be strict: partial answers or vague responses should be marked incorrect.
- Decisions must align with official IFAB Laws of the Game 2025/26 (Laws 11-Offside, 12-Fouls and Misconduct, etc.).
- Do NOT include any extra fields, comments, or text.

Scenario: ${questionContext}
Correct Answer: ${correctAnswer}
User Answer: ${userAnswer}`,
      maxOutputTokens: 100,
    })

    try {
      const result = parseAIJsonResponse(text) as any
      return NextResponse.json({
        isCorrect: result.isCorrect ?? false,
        confidence: result.confidence ?? 0,
      })
    } catch {
      // Fallback if JSON parsing fails
      return NextResponse.json({
        isCorrect: false,
        confidence: 0,
      })
    }
  } catch {
    return NextResponse.json({ error: "Failed to check answer" }, { status: 500 })
  }
}
