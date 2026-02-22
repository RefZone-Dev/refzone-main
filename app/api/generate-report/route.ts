import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      maxOutputTokens: 500,
    })

    return Response.json({ report: text })
  } catch (error) {
    console.error("[v0] Error generating report:", error)
    return Response.json({ error: "Failed to generate report" }, { status: 500 })
  }
}
