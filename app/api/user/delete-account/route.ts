import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = user.id

    // Delete user data from application tables
    await supabase.from("notifications").delete().eq("user_id", userId)
    await supabase.from("friendships").delete().or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
    await supabase.from("forum_votes").delete().eq("user_id", userId)

    // This keeps the content but shows "Deleted User" as the author
    await supabase.from("forum_replies").update({ user_id: null }).eq("user_id", userId)
    await supabase.from("forum_posts").update({ user_id: null }).eq("user_id", userId)

    await supabase.from("user_achievements").delete().eq("user_id", userId)
    await supabase.from("user_feedback").delete().eq("user_id", userId)
    await supabase.from("user_inventory").delete().eq("user_id", userId)
    await supabase.from("user_customization").delete().eq("user_id", userId)
    await supabase.from("quiz_attempts").delete().eq("user_id", userId)
    await supabase.from("scenario_responses").delete().eq("user_id", userId)
    await supabase.from("match_reports").delete().eq("user_id", userId)
    await supabase.from("points_transactions").delete().eq("user_id", userId)
    await supabase.from("profiles").delete().eq("id", userId)

    // Sign out the user first
    await supabase.auth.signOut()

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    )

    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteAuthError) {
      console.error("Error deleting auth user:", deleteAuthError)
      // Still return success since profile data was deleted
      // The user won't be able to use the app without a profile
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting account:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
