import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const { text: responseText } = await generateText({
      model: "deepseek/deepseek-chat",
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
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { appropriate: true }
    } catch {
      // If parsing fails, default to appropriate
      console.error("[v0] Failed to parse moderation response:", responseText)
      result = { appropriate: true }
    }

    return NextResponse.json({
      appropriate: result.appropriate,
      reason: result.reason || null,
      status: result.appropriate ? "approved" : "pending_review",
    })
  } catch (error) {
    console.error("[v0] Moderation check error:", error)
    // On error, default to allowing the post (fail open)
    return NextResponse.json({
      appropriate: true,
      reason: null,
      status: "approved",
    })
  }
}
