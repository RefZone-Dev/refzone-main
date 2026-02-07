import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()
    const supabase = await createClient()

    // Verify the requester is an admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: adminProfile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

    if (!adminProfile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check target user is not an admin
    const { data: targetProfile } = await supabase.from("profiles").select("is_admin").eq("id", userId).single()

    if (targetProfile?.is_admin) {
      return NextResponse.json({ error: "Cannot terminate admin accounts" }, { status: 400 })
    }

    // Delete user data in order (respecting foreign keys)
    await supabase.from("notifications").delete().eq("user_id", userId)
    await supabase.from("friendships").delete().or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
    await supabase.from("forum_post_votes").delete().eq("user_id", userId)

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

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    )

    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteAuthError) {
      console.error("Error deleting auth user:", deleteAuthError)
      // Still return success since profile data was deleted
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error terminating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
