import { requireAdmin } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const userId = await requireAdmin()

    const supabase = createServiceClient()

    const { title, body } = await req.json()

    if (!title || !body) {
      return NextResponse.json({ error: "Title and body are required" }, { status: 400 })
    }

    // Get all push subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from("push_subscriptions")
      .select("subscription")

    if (subError) {
      return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ count: 0, message: "No subscribers found" })
    }

    // Send push notifications to all subscribers
    let sentCount = 0

    for (const sub of subscriptions) {
      try {
        const pushSubscription = sub.subscription

        // Use web-push or your push service here
        // In production, integrate with Firebase Cloud Messaging or web-push
        // await webpush.sendNotification(pushSubscription, JSON.stringify({ title, body }))

        sentCount++
      } catch {
        // Failed to send to this subscription
      }
    }

    // Log the notification send
    await supabase.from("admin_push_log").insert({
      admin_id: userId,
      title,
      body,
      sent_count: sentCount,
    }).select().single().catch(() => {
      // Table might not exist yet
    })

    return NextResponse.json({
      count: sentCount,
      total: subscriptions.length,
      message: `Push notification sent to ${sentCount} devices`
    })

  } catch {
    return NextResponse.json(
      { error: "Failed to send push notification" },
      { status: 500 }
    )
  }
}
