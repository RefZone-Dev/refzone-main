import { createGroq } from "@ai-sdk/groq"
import { streamText } from "ai"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"), // Replaced openai/gpt-4o with Groq model
      prompt,
      maxOutputTokens: 500,
    })

    let fullText = ""
    for await (const chunk of result.textStream) {
      fullText += chunk
    }

    return Response.json({ report: fullText })
  } catch (error) {
    console.error("[v0] Error generating report:", error)
    return Response.json({ error: "Failed to generate report" }, { status: 500 })
  }
}
