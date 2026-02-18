import { createServiceClient } from "@/lib/supabase/service"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { createGroq } from "@ai-sdk/groq"
import { generateText } from "ai"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

const VALID_SCENARIO_TYPES = ["foul", "offside", "handball", "misconduct", "advantage", "var"] as const
type ScenarioType = (typeof VALID_SCENARIO_TYPES)[number]

function validateScenarioType(type: string): ScenarioType {
  const normalizedType = type.toLowerCase().trim()

  if (VALID_SCENARIO_TYPES.includes(normalizedType as ScenarioType)) {
    return normalizedType as ScenarioType
  }

  if (normalizedType.includes("foul") || normalizedType.includes("tackle") || normalizedType.includes("challenge")) {
    return "foul"
  }
  if (normalizedType.includes("offside") || normalizedType.includes("onside") || normalizedType.includes("off-side")) {
    return "offside"
  }
  if (normalizedType.includes("handball") || normalizedType.includes("hand ball") || normalizedType.includes("hand")) {
    return "handball"
  }
  if (
    normalizedType.includes("misconduct") ||
    normalizedType.includes("card") ||
    normalizedType.includes("yellow") ||
    normalizedType.includes("red") ||
    normalizedType.includes("dissent") ||
    normalizedType.includes("unsporting")
  ) {
    return "misconduct"
  }
  if (normalizedType.includes("advantage") || normalizedType.includes("play on")) {
    return "advantage"
  }
  if (normalizedType.includes("var") || normalizedType.includes("review") || normalizedType.includes("video")) {
    return "var"
  }

  return "foul"
}

export async function POST() {
  try {
    // Verify user is authenticated
    const supabaseAuth = await createClient()
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const supabase = createServiceClient()

    // Get config for prompts and LOTG document
    const { data: configData } = await supabase
      .from("admin_config")
      .select("config_key, config_value")
      .in("config_key", ["daily_scenario_prompt", "laws_of_the_game_document"])

    const scenarioPrompt =
      configData?.find((c) => c.config_key === "daily_scenario_prompt")?.config_value ||
      "Generate a realistic football refereeing scenario."
    const lawsDocument = configData?.find((c) => c.config_key === "laws_of_the_game_document")?.config_value || ""

    // Get existing scenarios for reference
    const { data: existingScenarios } = await supabase
      .from("scenarios")
      .select("title, description, scenario_type, law_category, correct_decision")
      .order("created_at", { ascending: false })
      .limit(50)

    // Get next scenario number
    const { count: totalScenarios } = await supabase.from("scenarios").select("*", { count: "exact", head: true })
    const nextScenarioNumber = (totalScenarios || 0) + 1

    let existingScenariosRef = ""
    if (existingScenarios && existingScenarios.length > 0) {
      existingScenariosRef = "\n\nEXISTING SCENARIOS (use as reference to avoid duplicates):\n"
      existingScenarios.forEach((s, i) => {
        existingScenariosRef += `${i + 1}. "${s.title}" - Type: ${s.scenario_type}, Law: ${s.law_category}\n   Description: ${s.description?.substring(0, 150) || "N/A"}...\n   Decision: ${s.correct_decision?.substring(0, 100) || "N/A"}...\n\n`
      })
    }

    // Generate scenario using AI
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: lawsDocument
        ? `You are a football referee instructor. You MUST reference this complete Laws of the Game document for accuracy:\n\n${lawsDocument}`
        : "You are a football referee instructor with knowledge of IFAB Laws of the Game.",
      prompt: `${scenarioPrompt}${existingScenariosRef}

IMPORTANT: Return ONLY valid JSON in this exact format:
{
  "title": "Scenario #${nextScenarioNumber}",
  "description": "2-3 sentence scenario description",
  "difficulty": "easy" | "medium" | "hard",
  "scenario_type": "foul" | "offside" | "handball" | "misconduct" | "advantage" | "var",
  "correct_decision": "The correct referee decision",
  "explanation": "Why this is correct with Law references",
  "points_value": 10 | 15 | 20,
  "law_category": "Law 1" through "Law 17",
  "law_section": "Section name"
}

CRITICAL: The title MUST be exactly "Scenario #${nextScenarioNumber}" - no descriptive titles allowed.`,
    })

    // Parse AI response
    let cleanedText = text.trim()
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.slice(7)
    }
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.slice(3)
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.slice(0, -3)
    }
    cleanedText = cleanedText.trim()

    const jsonStartIndex = cleanedText.indexOf("{")
    const jsonEndIndex = cleanedText.lastIndexOf("}")
    if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonStartIndex < jsonEndIndex) {
      cleanedText = cleanedText.substring(jsonStartIndex, jsonEndIndex + 1)
    }

    const scenarioData = JSON.parse(cleanedText)
    const validatedScenarioType = validateScenarioType(scenarioData.scenario_type || "foul")

    // Insert new scenario
    const { data: newScenario, error } = await supabase
      .from("scenarios")
      .insert({
        title: scenarioData.title,
        description: scenarioData.description,
        difficulty: scenarioData.difficulty,
        scenario_type: validatedScenarioType,
        correct_decision: scenarioData.correct_decision,
        explanation: scenarioData.explanation,
        points_value: scenarioData.points_value || 10,
        is_active: true,
        law_category: scenarioData.law_category || null,
        law_section: scenarioData.law_section || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to insert scenario", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, scenario: newScenario })
  } catch (error) {
    console.error("Auto scenario generation error:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: "Generation failed", details: errorMessage }, { status: 500 })
  }
}
