import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { displayName, currentUserId } = await request.json()

    if (!displayName) {
      return NextResponse.json({ available: false, error: "Display name is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if display name exists for another user
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("display_name", displayName)
      .neq("id", currentUserId || "00000000-0000-0000-0000-000000000000")
      .maybeSingle()

    if (error) {
      console.error("[v0] Error checking display name:", error)
      return NextResponse.json({ available: false, error: "Database error" }, { status: 500 })
    }

    // If data exists, name is taken. If null, name is available.
    return NextResponse.json({ available: !data })
  } catch (error) {
    console.error("[v0] Error in check-display-name route:", error)
    return NextResponse.json({ available: false, error: "Server error" }, { status: 500 })
  }
}
