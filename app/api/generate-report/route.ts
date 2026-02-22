import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"

const deepseek = createOpenAI({
  apiKey: "sk-29fe8c9737fc4dde86e97d1621d24586",
  baseURL: "https://api.deepseek.com/v1",
})

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      prompt,
      maxTokens: 500,
    })

    return Response.json({ report: text })
  } catch (error) {
    console.error("[v0] Error generating report:", error)
    return Response.json({ error: "Failed to generate report" }, { status: 500 })
  }
}
