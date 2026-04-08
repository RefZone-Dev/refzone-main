import { requireAdmin } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await requireAdmin()
    const { userId } = await params

    const serviceClient = createServiceClient()

    // Get user profile
    const { data: profile } = await serviceClient
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get email from Clerk
    let email = "N/A"
    try {
      const clerk = await clerkClient()
      const clerkUser = await clerk.users.getUser(userId)
      email = clerkUser.emailAddresses?.[0]?.emailAddress || "N/A"
    } catch {}

    // Get quiz completions count
    const { count: quizzesCompleted } = await serviceClient
      .from("quiz_attempts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    // Get scenario completions count
    const { count: scenariosCompleted } = await serviceClient
      .from("scenario_attempts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    // Get recent activity
    let recentActivity: any[] = []
    try {
      const { data: activity } = await serviceClient
        .from("user_activity")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20)
      if (activity) recentActivity = activity
    } catch {}

    return NextResponse.json({
      ...profile,
      email,
      quizzes_completed: quizzesCompleted || 0,
      scenarios_completed: scenariosCompleted || 0,
      recentActivity,
      quizPerformance: [],
    })
  } catch {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }
}
