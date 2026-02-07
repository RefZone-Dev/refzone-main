import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { friendshipId, action } = await request.json()

    if (!friendshipId || !action || !["accept", "decline"].includes(action)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the friendship to verify user is the addressee
    const { data: friendship, error: fetchError } = await supabase
      .from("friendships")
      .select("*")
      .eq("id", friendshipId)
      .single()

    if (fetchError || !friendship) {
      return NextResponse.json({ error: "Friendship not found" }, { status: 404 })
    }

    // Verify the current user is the addressee (recipient of the request)
    if (friendship.addressee_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (action === "accept") {
      // Accept the friend request
      const { error } = await supabase.from("friendships").update({ status: "accepted" }).eq("id", friendshipId)

      if (error) {
        console.error("[v0] Error accepting friend request:", error)
        return NextResponse.json({ error: "Failed to accept friend request" }, { status: 500 })
      }

      // Send notification to requester
      await supabase.from("notifications").insert({
        user_id: friendship.requester_id,
        type: "friend_accepted",
        title: "Friend Request Accepted",
        message: "Your friend request was accepted!",
        link: "/leaderboard",
      })
    } else {
      // Decline the friend request - delete it
      const { error } = await supabase.from("friendships").delete().eq("id", friendshipId)

      if (error) {
        console.error("[v0] Error declining friend request:", error)
        return NextResponse.json({ error: "Failed to decline friend request" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, action })
  } catch (error) {
    console.error("[v0] Error in friendship respond route:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
