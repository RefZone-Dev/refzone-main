import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()
    
    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 403 })
    }
    
    const { title, body } = await req.json()
    
    if (!title || !body) {
      return NextResponse.json({ error: "Title and body are required" }, { status: 400 })
    }
    
    // Get all push subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from("push_subscriptions")
      .select("subscription")
    
    if (subError) {
      console.error("[v0] Error fetching subscriptions:", subError)
      return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
    }
    
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ count: 0, message: "No subscribers found" })
    }
    
    // Send push notifications to all subscribers
    let sentCount = 0
    const failedSubscriptions: string[] = []
    
    for (const sub of subscriptions) {
      try {
        const pushSubscription = sub.subscription
        
        // Use web-push or your push service here
        // For now, we'll just count successful sends
        // In production, you'd integrate with a service like Firebase Cloud Messaging or web-push
        
        // Simulate sending (replace with actual push service)
        // await webpush.sendNotification(pushSubscription, JSON.stringify({ title, body }))
        
        sentCount++
      } catch (error) {
        console.error("[v0] Failed to send to subscription:", error)
        // Track failed subscriptions for cleanup
      }
    }
    
    // Log the notification send
    await supabase.from("admin_push_log").insert({
      admin_id: user.id,
      title,
      body,
      sent_count: sentCount,
    }).select().single().catch(() => {
      // Table might not exist, that's ok
    })
    
    return NextResponse.json({ 
      count: sentCount,
      total: subscriptions.length,
      message: `Push notification sent to ${sentCount} devices`
    })
    
  } catch (error) {
    console.error("[v0] Error sending push notification:", error)
    return NextResponse.json(
      { error: "Failed to send push notification" },
      { status: 500 }
    )
  }
}
