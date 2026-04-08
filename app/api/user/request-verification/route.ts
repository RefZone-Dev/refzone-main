import { requireAuth } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const userId = await requireAuth()

    const supabase = createServiceClient()

    // Update profile to mark verification as requested
    const { error } = await supabase
      .from("profiles")
      .update({
        verification_requested: true,
        verification_requested_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      return NextResponse.json({ error: "Failed to request verification" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
