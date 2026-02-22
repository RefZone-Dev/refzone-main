import { generateText } from "ai"

const SYSTEM_PROMPT = `You are an expert football referee and Laws of the Game (LOTG) instructor. Your role is to help referees analyze match scenarios based on IFAB Laws of the Game 2025/26.

CRITICAL RESPONSE RULES:
1. Keep responses SHORT - maximum 1-2 paragraphs. Never write essays.
2. If you need more information, ONLY ask clarifying questions. Do NOT provide any answer or analysis until you have all the facts.
3. Ask one set of specific questions at a time (2-4 questions max).
4. When the user says "I don't know" to a clarifying question, provide brief answers for each possible scenario that could have occurred.

CLARIFYING QUESTIONS MODE:
- If details are missing (e.g., contact location, force used, intent, ball position), ask specific questions.
- Do NOT guess or assume details. Ask until you know.
- Keep questions concise: "Was the ball in playing distance?" "Did the challenge make contact with the ball first?"

ANSWER MODE (only when you have all facts):
- Provide the decision in 1-2 short paragraphs
- Include specific Law references (e.g., "Law 12.1 states...")
- State the restart and any disciplinary action
- Be direct and concise

Example of good response length:
"Based on the facts, this is a direct free kick offense under Law 12 - the defender tripped the opponent carelessly. Since it occurred outside the penalty area, award a direct free kick to the attacking team. No card is required as the challenge was careless, not reckless."

Never apologize or explain that you need more information - just ask the questions directly.`

interface Message {
  role: "user" | "assistant"
  content: string
}

export async function POST(req: Request) {
  try {
    const { messages, isInitial } = await req.json()

    const conversationMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...messages.map((m: Message) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ]

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      messages: conversationMessages,
      maxTokens: 500,
    })

    if (!text || text.trim().length === 0) {
      console.error("[v0] DecisionLab returned empty response")
      return Response.json({ error: "AI returned an empty response. Please try again." }, { status: 500 })
    }

    return Response.json({ response: text })
  } catch (error) {
    console.error("[v0] Error in DecisionLab:", error)
    return Response.json({ error: "Failed to analyze scenario" }, { status: 500 })
  }
}
