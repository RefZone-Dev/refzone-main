import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Verify user is authenticated and is an admin
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    if (profileError || !profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const { title, message, link, isImportant } = await request.json()

    if (!title?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Title and message are required" }, { status: 400 })
    }

    // Use service client to bypass RLS for inserting notifications
    const serviceClient = createServiceClient()

    // Get all user profiles
    const { data: profiles, error: profilesError } = await serviceClient.from("profiles").select("id")

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ error: "No users found" }, { status: 404 })
    }

    // Create notifications for all users
    const notifications = profiles.map((profile) => ({
      user_id: profile.id,
      type: "admin_announcement",
      title: title.trim(),
      message: message.trim(),
      link: link?.trim() || null,
      is_read: false,
      is_important: isImportant || false,
    }))

    const { data: insertedNotifications, error: insertError } = await serviceClient
      .from("notifications")
      .insert(notifications)
      .select()

    if (insertError) {
      console.error("Error inserting notifications:", insertError)
      return NextResponse.json(
        {
          error: "Failed to send notifications",
          details: insertError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: `Notification sent to ${profiles.length} users`,
      count: profiles.length,
    })
  } catch (error) {
    console.error("Error in send-notification:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
