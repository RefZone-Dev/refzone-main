import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"
import { NextResponse } from "next/server"

const deepseek = createOpenAI({
  apiKey: "sk-29fe8c9737fc4dde86e97d1621d24586",
  baseURL: "https://api.deepseek.com/v1",
})

export async function POST(req: Request) {
  try {
    const { userAnswer, correctAnswer, questionContext } = await req.json()

    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
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

    // Parse the JSON response from the AI
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0])
      return NextResponse.json({
        isCorrect: result.isCorrect ?? false,
        confidence: result.confidence ?? 0,
      })
    }

    // Fallback if JSON parsing fails
    return NextResponse.json({
      isCorrect: false,
      confidence: 0,
    })
  } catch (error) {
    console.error("[v0] Error checking answer:", error)
    return NextResponse.json({ error: "Failed to check answer" }, { status: 500 })
  }
}
