import { requireAdmin } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, video_url, ai_answer, ai_description, law_category, law_section, scenario_type, difficulty, points_value } = body

    if (!video_url || !ai_answer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data, error } = await supabase.from("scenarios").insert({
      title,
      video_url,
      ai_answer,
      ai_description,
      law_category: law_category || null,
      law_section: law_section || null,
      scenario_type,
      difficulty,
      is_active: true,
      points_value: points_value || 10,
    }).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, scenario: data })
  } catch (err) {
    console.error("Save scenario error:", err)
    return NextResponse.json({ error: "Failed to save scenario" }, { status: 500 })
  }
}
