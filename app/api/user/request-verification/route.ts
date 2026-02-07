import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update profile to mark verification as requested
    const { error } = await supabase
      .from("profiles")
      .update({
        verification_requested: true,
        verification_requested_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      console.error("[v0] Error requesting verification:", error)
      return NextResponse.json({ error: "Failed to request verification" }, { status: 500 })
    }

    // Create notification for admins (we can add this later)
    // For now, admins will see verification requests in their admin panel

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in request-verification route:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
