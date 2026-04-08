import { generateText } from "ai"
import { getModel } from "@/lib/ai-model"

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
- Start with the key decision in **bold** (e.g. "**Direct free kick + yellow card.**")
- Include specific Law references (e.g. "Law 12.1 states...")
- Use **bold** for key terms and decisions
- Use *italics* for emphasis
- End with a brief summary line starting with "Summary:" or "Verdict:"
- Keep responses concise — 2-3 short paragraphs max
- Use bullet points (- ) for listing multiple factors

Example format:
"**Direct free kick — no card required.**

The defender tripped the opponent *carelessly* under Law 12.1. Since the challenge occurred outside the penalty area, the restart is a direct free kick.

The contact was careless but not *reckless*, so no disciplinary action is warranted.

Law 12.1 — A direct free kick is awarded if a player trips or attempts to trip an opponent.

Verdict: **Direct free kick** to the attacking team. No card."

Never apologize or explain that you need more information - just ask the questions directly.`

interface Message {
  role: "user" | "assistant"
  content: string
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Invalid request: messages must be an array" }, { status: 400 })
    }

    const conversationMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...messages.map((m: Message) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ]

    const { text } = await generateText({
      model: getModel(),
      messages: conversationMessages,
      maxOutputTokens: 500,
    })

    if (!text || text.trim().length === 0) {
      return Response.json({ error: "AI returned an empty response. Please try again." }, { status: 500 })
    }

    return Response.json({ response: text })
  } catch (error) {
    console.error("[Decision Lab API Error]", error)
    return Response.json({
      error: "Failed to analyze scenario",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
