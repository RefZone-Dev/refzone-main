import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch profile first (needed for redirect check)
  const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // If profile doesn't exist (e.g., database not set up), show a setup message
  // Don't redirect to login as that creates an infinite loop with the proxy
  if (!profile || profileError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">Database Setup Required</h1>
          <p className="text-muted-foreground">
            Your profile could not be loaded. Please run the database setup script first.
          </p>
          <p className="text-sm text-muted-foreground">
            Run the SQL script located at <code className="bg-muted px-2 py-1 rounded">/scripts/setup-database.sql</code> in your Supabase SQL Editor.
          </p>
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="text-sm text-primary hover:underline">
              Sign out
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Check if user needs to set up their username (moved from middleware for performance)
  const displayName = profile.display_name?.trim()
  const needsUsername =
    !profile.has_set_username && (!displayName || displayName === "" || displayName.includes("@"))

  if (needsUsername) {
    redirect("/auth/setup-username")
  }

  const now = new Date()
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
    .toISOString()
    .split("T")[0]
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  // Run ALL remaining queries in parallel
  const [
    activityResult,
    scenarioResult,
    quizResult,
    forumResult,
    lawPerfResult,
    recentResult,
  ] = await Promise.all([
    // Today's activity
    supabase
      .from("daily_activity_log")
      .select("*")
      .eq("user_id", user.id)
      .eq("activity_date", today)
      .maybeSingle(),
    // Scenario responses (only need is_correct)
    supabase
      .from("scenario_responses")
      .select("is_correct")
      .eq("user_id", user.id),
    // Quiz attempts
    supabase
      .from("quiz_attempts")
      .select("score, total_possible, percentage")
      .eq("user_id", user.id),
    // Forum posts (latest 3)
    supabase
      .from("forum_posts")
      .select("id, title, content, category, created_at, user_id, forum_votes(vote_type), forum_replies(id)")
      .eq("moderation_status", "approved")
      .order("created_at", { ascending: false })
      .limit(3),
    // Law performance (weakest areas)
    supabase
      .from("user_law_performance")
      .select("*")
      .eq("user_id", user.id)
      .order("accuracy", { ascending: true })
      .limit(5),
    // Recent scenario responses for chart
    supabase
      .from("scenario_responses")
      .select("is_correct, created_at")
      .eq("user_id", user.id)
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: true }),
  ])

  const todayActivity = activityResult.data || null
  const scenarioResponses = scenarioResult.data || []
  const quizAttempts = quizResult.data || []
  const lawPerformance = lawPerfResult.data || []
  const recentResponses = recentResult.data || []

  const scenarioAccuracy =
    scenarioResponses.length > 0
      ? Math.round((scenarioResponses.filter((r) => r.is_correct).length / scenarioResponses.length) * 100)
      : 0

  const quizAccuracy =
    quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((acc, q) => acc + (q.percentage || 0), 0) / quizAttempts.length)
      : 0

  // Enrich forum posts with profile data in one batch
  let forumPosts: any[] = []
  const postsData = forumResult.data || []
  if (postsData.length > 0) {
    const userIds = [...new Set(postsData.map((p) => p.user_id).filter(Boolean))]
    const { data: profiles } =
      userIds.length > 0
        ? await supabase.from("profiles").select("id, display_name").in("id", userIds)
        : { data: [] }

    const profileMap = new Map()
    profiles?.forEach((p) => profileMap.set(p.id, { display_name: p.display_name }))

    forumPosts = postsData.map((post) => ({
      ...post,
      profiles: post.user_id ? profileMap.get(post.user_id) || { display_name: "Unknown" } : null,
    }))
  }

  return (
    <DashboardContent
      profile={profile}
      todayActivity={todayActivity}
      scenarioAccuracy={scenarioAccuracy}
      quizAccuracy={quizAccuracy}
      forumPosts={forumPosts}
      lawPerformance={lawPerformance}
      recentResponses={recentResponses}
      totalScenarios={scenarioResponses.length}
      totalQuizzes={quizAttempts.length}
    />
  )
}

