import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const { answer } = await request.json()

    if (!answer) {
      return NextResponse.json({ error: 'Answer is required' }, { status: 400 })
    }

    const prompt = `You are an expert football/soccer referee analyzing a scenario answer to categorize it by law.

Given the following referee scenario answer, suggest the most relevant law category and specific law section:

ANSWER: "${answer}"

Respond with JSON in this exact format:
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

Be specific and accurate based on the Laws of the Game.`

    const response = await fetch('https://gateway.ai.cloudflare.com/v1/vercel/default/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY || process.env.AI_GATEWAY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      console.error('[v0] AI tag suggestion error:', await response.text())
      return NextResponse.json({ error: 'Failed to generate tags' }, { status: 500 })
    }

    const data = await response.json()
    const tags = JSON.parse(data.choices[0].message.content)

    return NextResponse.json({ tags })
  } catch (error) {
    console.error('[v0] Error in tag suggestion:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 })
  }
}
