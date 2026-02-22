import { generateText } from "ai"
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { answer } = await request.json()

    if (!answer) {
      return NextResponse.json({ error: 'Answer is required' }, { status: 400 })
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are an expert football/soccer referee analyzing a scenario answer to categorize it by law.

Given the following referee scenario answer, suggest the most relevant law category and specific law section:

ANSWER: "${answer}"

Respond with ONLY valid JSON in this exact format:
{
  "lawCategory": "Law X: Brief Title",
  "lawSection": "Specific section or subsection if applicable",
  "scenarioType": "one of: foul, offside, handball, misconduct, advantage, penalty, var, other",
  "difficulty": "one of: easy, medium, hard, expert"
}

Examples of law categories:
- Law 11: Offside
- Law 12: Fouls and Misconduct
- Law 14: The Penalty Kick
- Law 5: The Referee
- etc.

Be specific and accurate based on the Laws of the Game.`,
      maxOutputTokens: 200,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse tags' }, { status: 500 })
    }

    const tags = JSON.parse(jsonMatch[0])
    return NextResponse.json({ tags })
  } catch (error) {
    console.error('[v0] Error in tag suggestion:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 })
  }
}
