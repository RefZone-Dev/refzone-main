import { createServiceClient } from "@/lib/supabase/service"
import { NextResponse } from "next/server"
import { createGroq } from "@ai-sdk/groq"
import { generateText } from "ai"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export const dynamic = "force-dynamic"

// This endpoint can be called by any external cron service (e.g. Hostinger cron job, cron-job.org)
// Example: curl -H "Authorization: Bearer YOUR_SECRET" https://app.refzone.com.au/api/cron/generate-daily-scenario
export async function GET(request: Request) {
  // Verify the request with a shared secret
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createServiceClient()

  try {
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `Generate a realistic football/soccer refereeing scenario for training purposes based on the IFAB Laws of the Game 2025/26. The scenario should test decision-making skills and be based on actual Laws.

IMPORTANT: All scenarios, decisions, and explanations MUST reference and comply with the official IFAB Laws of the Game 2025/26, including:
- Law 11: Offside
- Law 12: Fouls and Misconduct
- Law 13: Free Kicks
- Law 14: The Penalty Kick
- And other relevant Laws

Return ONLY valid JSON (no markdown, no code blocks) in this exact format:
{
  "title": "Brief scenario title (max 60 chars)",
  "description": "Detailed scenario description (2-3 sentences describing what happens)",
  "difficulty": "easy" | "medium" | "hard",
  "scenario_type": "foul" | "offside" | "handball" | "misconduct" | "advantage" | "var",
  "correct_decision": "The correct referee decision according to IFAB Laws (e.g., 'Penalty Kick', 'Play On', 'Yellow Card')",
  "explanation": "Why this is the correct decision with direct reference to specific IFAB Laws of the Game 2025/26 (2-3 sentences, cite specific Law numbers)",
  "points_value": 10 | 15 | 20
}

Make the scenario realistic, educational, and strictly compliant with IFAB Laws of the Game 2025/26. All explanations must cite the specific Law(s) that apply.`,
    })

    // Parse the AI response
    let cleanedText = text.trim()
    if (cleanedText.startsWith("```json")) cleanedText = cleanedText.slice(7)
    if (cleanedText.startsWith("```")) cleanedText = cleanedText.slice(3)
    if (cleanedText.endsWith("```")) cleanedText = cleanedText.slice(0, -3)
    cleanedText = cleanedText.trim()

    const jsonStartIndex = cleanedText.indexOf("{")
    const jsonEndIndex = cleanedText.lastIndexOf("}")
    if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
      cleanedText = cleanedText.substring(jsonStartIndex, jsonEndIndex + 1)
    }

    const scenarioData = JSON.parse(cleanedText)

    // Deactivate old scenarios (keep only last 7 days of scenarios active)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    await supabase.from("scenarios").update({ is_active: false }).lt("created_at", sevenDaysAgo.toISOString())

    // Insert the new scenario
    const { data: newScenario, error } = await supabase
      .from("scenarios")
      .insert({
        title: scenarioData.title,
        description: scenarioData.description,
        difficulty: scenarioData.difficulty,
        scenario_type: scenarioData.scenario_type,
        correct_decision: scenarioData.correct_decision,
        explanation: scenarioData.explanation,
        points_value: scenarioData.points_value,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("Error inserting scenario:", error)
      return NextResponse.json({ error: "Failed to insert scenario" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      scenario: newScenario,
    })
  } catch (error) {
    console.error("Error generating daily scenario:", error)
    return NextResponse.json({ error: "Failed to generate scenario" }, { status: 500 })
  }
}
