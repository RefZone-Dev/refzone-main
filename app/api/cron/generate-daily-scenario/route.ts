import { NextResponse } from "next"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { generateText } from "ai"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// This endpoint will be called by Vercel Cron daily
export async function GET(request: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookies) => {
        cookies.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      },
    },
  })

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
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
    const scenarioData = JSON.parse(text.trim())

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

    console.log("[v0] Daily scenario generated:", newScenario)

    return NextResponse.json({
      success: true,
      scenario: newScenario,
    })
  } catch (error) {
    console.error("Error generating daily scenario:", error)
    return NextResponse.json({ error: "Failed to generate scenario" }, { status: 500 })
  }
}
