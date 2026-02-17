import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, BookOpen, TrendingUp, Flame, Award } from "lucide-react"
import Link from "next/link"

export default async function AppDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  let profile = null
  let scenarioCount = 0
  let quizCount = 0
  let accuracy = 0
  try {
    // Fetch all data in parallel
    const [profileResult, scenarioCountResult, quizCountResult, scenarioResponsesResult] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("scenario_responses").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("quiz_attempts").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("scenario_responses").select("is_correct").eq("user_id", user.id),
    ])

    profile = profileResult.data
    scenarioCount = scenarioCountResult.count || 0
    quizCount = quizCountResult.count || 0

    const scenarioResponses = scenarioResponsesResult.data
    accuracy =
      scenarioResponses && scenarioResponses.length > 0
        ? Math.round((scenarioResponses.filter((r) => r.is_correct).length / scenarioResponses.length) * 100)
        : 0

  } catch (error) {
    console.error("Dashboard error:", error)
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {profile?.display_name || "Referee"}!</h1>
        <p className="text-muted-foreground">Ready to sharpen your skills today?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
            <Flame className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{profile?.current_streak || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">days in a row</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Points</CardTitle>
            <Award className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{profile?.total_points || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">points earned</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Accuracy</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{accuracy}%</div>
            <p className="text-xs text-muted-foreground mt-1">correct decisions</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scenarios</CardTitle>
            <Target className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{scenarioCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground">Practice Scenarios</CardTitle>
                <p className="text-sm text-muted-foreground">Real-game situations to test your decision-making</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{scenarioCount || 0}</p>
                <p className="text-sm text-muted-foreground">completed</p>
              </div>
              <Button asChild>
                <Link href="/scenarios">Start Training</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-secondary/50 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <BookOpen className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-foreground">Take Quizzes</CardTitle>
                <p className="text-sm text-muted-foreground">Test your knowledge of Laws of the Game</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{quizCount || 0}</p>
                <p className="text-sm text-muted-foreground">completed</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/quizzes">Browse Quizzes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
