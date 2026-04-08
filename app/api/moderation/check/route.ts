import { requireAuth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { generateText } from "ai"
import { parseAIJsonResponse } from "@/lib/parse-ai-json"
import { getModel } from "@/lib/ai-model"

export async function POST(request: Request) {
  try {
    const userId = await requireAuth()

    const { title, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const { text: responseText } = await generateText({
      model: getModel(),
      system: `You are a content moderation assistant for a referee training community forum.
Your job is to analyze forum posts and determine if they are appropriate.

Posts should be flagged as inappropriate if they contain:
- Hate speech, discrimination, or slurs
- Explicit sexual content
- Threats of violence
- Harassment or bullying
- Spam or advertising
- Personal information sharing (doxxing)
- Severe profanity or vulgarity

Posts that are OK include:
- Questions about referee rules and scenarios
- Discussions about sports officiating
- Tips and advice for referees
- Constructive criticism and debates
- Minor informal language

Respond with ONLY a JSON object in this exact format:
{"appropriate": true/false, "reason": "brief explanation if flagged"}

Be lenient - only flag clearly inappropriate content. Normal discussions, even heated debates about calls, are fine.`,
      prompt: `Please analyze this forum post:\n\nTitle: ${title}\n\nContent: ${content}`,
      temperature: 0.1,
      maxOutputTokens: 150,
    })

    // Parse the AI response
    let result: { appropriate: boolean; reason?: string }
    try {
      result = parseAIJsonResponse(responseText) as { appropriate: boolean; reason?: string }
    } catch {
      // If parsing fails, default to appropriate
      result = { appropriate: true }
    }

    return NextResponse.json({
      appropriate: result.appropriate,
      reason: result.reason || null,
      status: result.appropriate ? "approved" : "pending_review",
    })
  } catch {
    // On error, default to allowing the post (fail open)
    return NextResponse.json({
      appropriate: true,
      reason: null,
      status: "approved",
    })
  }
}
