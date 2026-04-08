import { requireAuth } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, Medal, Award, Crown } from "lucide-react"
import { LeaderboardClient } from "./leaderboard-client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { isUnder16 } from "@/lib/age-utils"

export const metadata = {
  title: "RefZone",
  description: "See how referees rank worldwide",
}

export default async function LeaderboardPage() {
  const supabase = createServiceClient()
  let userId: string | null = null
  try {
    userId = await requireAuth()
  } catch {
    // Not logged in - that's ok for leaderboard
  }

  // Fetch verified profiles ordered by streak (only email-verified users)
  const { data: leaderboard } = await supabase
    .from("profiles")
    .select(`
      id,
      display_name,
      total_points,
      current_streak,
      longest_streak,
      is_verified
    `)
    .eq("email_verified", true)
    .order("current_streak", { ascending: false })
    .limit(100)

  let friendships = null
  let customizations = null
  let profileRestricted = false

  if (userId) {
    const userIds = leaderboard?.map((p) => p.id) || []
    const [currentProfileResult, friendshipsResult] = await Promise.all([
      supabase.from("profiles").select("date_of_birth").eq("id", userId).single(),
      supabase.from("friendships").select("*").or(`requester_id.eq.${userId},addressee_id.eq.${userId}`),
    ])

    profileRestricted = isUnder16(currentProfileResult.data?.date_of_birth)
    friendships = friendshipsResult.data
  }

  // Create a map of friendship statuses
  const friendshipMap = new Map()
  friendships?.forEach((f: any) => {
    if (userId) {
      const otherId = f.requester_id === userId ? f.addressee_id : f.requester_id
      friendshipMap.set(otherId, {
        status: f.status,
        isRequester: f.requester_id === userId,
        id: f.id,
      })
    }
  })

  // Find current user's rank
  const userRank = userId ? (leaderboard?.findIndex((p) => p.id === userId) ?? -1) : -1

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {!userId && (
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-foreground mb-2">Join the Competition</h3>
                <p className="text-muted-foreground">
                  Sign up to compete in the leaderboard, add friends, and track your progress
                </p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <Button asChild className="shadow-md">
                  <Link href="/auth/sign-up">Sign Up Free</Link>
                </Button>
                <Button asChild variant="outline" className="shadow-sm bg-transparent">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">See how referees rank by streak</p>
        </div>
        {userRank >= 0 && (
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="py-3 px-4 flex items-center gap-3">
              <Flame className="h-5 w-5 text-primary" />
              <span>
                Your Rank: <strong className="text-primary">#{userRank + 1}</strong>
              </span>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Top 3 Podium */}
      {leaderboard && leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Second Place */}
          <Card className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-gray-300 dark:border-gray-700 mt-8">
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-400 text-white">
                  <Medal className="h-6 w-6" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">#2</p>
              <p className="font-semibold truncate">{leaderboard[1]?.display_name || "User"}</p>
              <p className="text-sm text-muted-foreground">{leaderboard[1]?.current_streak} day streak</p>
            </CardContent>
          </Card>

          {/* First Place */}
          <Card className="bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-900 dark:to-yellow-900 border-amber-400 dark:border-amber-600">
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-white">
                  <Crown className="h-8 w-8" />
                </div>
              </div>
              <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">#1</p>
              <p className="font-semibold truncate">{leaderboard[0]?.display_name || "User"}</p>
              <p className="text-sm text-muted-foreground">{leaderboard[0]?.current_streak} day streak</p>
            </CardContent>
          </Card>

          {/* Third Place */}
          <Card className="bg-gradient-to-br from-orange-100 to-amber-200 dark:from-orange-900 dark:to-amber-900 border-orange-300 dark:border-orange-700 mt-8">
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-white">
                  <Award className="h-6 w-6" />
                </div>
              </div>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">#3</p>
              <p className="font-semibold truncate">{leaderboard[2]?.display_name || "User"}</p>
              <p className="text-sm text-muted-foreground">{leaderboard[2]?.current_streak} day streak</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>All Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <LeaderboardClient
            leaderboard={leaderboard || []}
            currentUserId={userId || null}
            friendshipMap={Object.fromEntries(friendshipMap)}
            badgeMap={{}}
            profileRestricted={profileRestricted}
          />
        </CardContent>
      </Card>
    </div>
  )
}
