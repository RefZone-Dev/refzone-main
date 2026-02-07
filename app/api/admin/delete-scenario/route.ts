import { createServiceClient } from "@/lib/supabase/service"
import { NextResponse } from "next/server"

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const scenarioId = searchParams.get("id")
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    if (!scenarioId) {
      return NextResponse.json({ error: "Missing scenario ID" }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Verify user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single()

    if (profileError || !profile?.is_admin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    // Delete scenario responses first (cascade should handle but be explicit)
    await supabase.from("scenario_responses").delete().eq("scenario_id", scenarioId)

    // Delete the scenario using service role (bypasses RLS)
    const { error: deleteError } = await supabase.from("scenarios").delete().eq("id", scenarioId)

    if (deleteError) {
      console.error("[v0] Error deleting scenario:", deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    // Verify deletion
    const { data: stillExists } = await supabase.from("scenarios").select("id").eq("id", scenarioId).single()

    if (stillExists) {
      return NextResponse.json({ error: "Scenario still exists after delete attempt" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete scenario error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
