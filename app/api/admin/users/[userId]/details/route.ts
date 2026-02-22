import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const serviceClient = createServiceClient()
  const { data: adminProfile } = await serviceClient
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (!adminProfile?.is_admin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  // Get user profile
  const { data: profile } = await serviceClient
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (!profile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Get auth email
  let email = "N/A"
  try {
    const { data: authUser } = await serviceClient.auth.admin.getUserById(userId)
    email = authUser?.user?.email || "N/A"
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

  // Get recent activity from user_activity if it exists
  let recentActivity: any[] = []
  try {
    const { data: activity } = await serviceClient
      .from("user_activity")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20)
    
    if (activity) recentActivity = activity
  } catch {
    // Table may not exist
  }

  return NextResponse.json({
    ...profile,
    email,
    quizzes_completed: quizzesCompleted || 0,
    scenarios_completed: scenariosCompleted || 0,
    recentActivity,
    quizPerformance: [],
  })
}
