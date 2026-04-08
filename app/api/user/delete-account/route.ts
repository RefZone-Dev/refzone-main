import { requireAuth } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const userId = await requireAuth()
    const supabase = createServiceClient()

    // Delete user data from application tables
    await supabase.from("user_seen_important_notifications").delete().eq("user_id", userId)
    await supabase.from("user_feedback").delete().eq("user_id", userId)
    await supabase.from("user_achievements").delete().eq("user_id", userId)
    await supabase.from("quiz_answers").delete().eq("user_id", userId)
    await supabase.from("quiz_attempts").delete().eq("user_id", userId)
    await supabase.from("scenario_responses").delete().eq("user_id", userId)
    await supabase.from("reports").delete().eq("user_id", userId)
    await supabase.from("profiles").delete().eq("id", userId)

    // Delete the Clerk auth user
    try {
      const clerk = await clerkClient()
      await clerk.users.deleteUser(userId)
    } catch (err) {
      console.error("Error deleting Clerk user:", err)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting account:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
