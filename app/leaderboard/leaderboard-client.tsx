"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Trophy, UserPlus, UserCheck, Clock, Star, UserMinus, Search } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { VerifiedBadge } from "@/components/verified-badge"
import Link from "next/link"

interface LeaderboardUser {
  id: string
  display_name: string
  total_points: number
  current_streak: number
  longest_streak: number
  is_verified: boolean
}

interface FriendshipStatus {
  status: string
  isRequester: boolean
  id: string
}

interface LeaderboardClientProps {
  leaderboard: LeaderboardUser[]
  currentUserId: string | null
  friendshipMap: Record<string, FriendshipStatus>
  badgeMap: Record<string, { name: string; preview_data: any }>
  profileRestricted?: boolean
}

export function LeaderboardClient({ leaderboard, currentUserId, friendshipMap, badgeMap, profileRestricted = false }: LeaderboardClientProps) {
  const [friendships, setFriendships] = useState<Record<string, FriendshipStatus>>(friendshipMap)
  const [loading, setLoading] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const sendFriendRequest = async (userId: string) => {
    setLoading(userId)
    try {
      const supabase = createClient()

      const { data: friendship, error } = await supabase
        .from("friendships")
        .insert({
          requester_id: currentUserId,
          addressee_id: userId,
          status: "pending",
        })
        .select()
        .single()

      if (!error && friendship) {
        setFriendships((prev) => ({
          ...prev,
          [userId]: { status: "pending", isRequester: true, id: friendship.id },
        }))

        await supabase.from("notifications").insert({
          user_id: userId,
          type: "friend_request",
          title: "New Friend Request",
          message: "Someone wants to be your friend!",
          related_user_id: currentUserId,
          related_friendship_id: friendship.id,
          link: "/leaderboard",
        })
      }
    } catch (error) {
      console.error("[v0] Error sending friend request:", error)
    } finally {
      setLoading(null)
    }
  }

  const acceptFriendRequest = async (userId: string, friendshipId: string) => {
    setLoading(userId)
    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("friendships")
        .update({ status: "accepted" })
        .eq("requester_id", userId)
        .eq("addressee_id", currentUserId)

      if (!error) {
        setFriendships((prev) => ({
          ...prev,
          [userId]: { ...prev[userId], status: "accepted" },
        }))

        await supabase.from("notifications").insert({
          user_id: userId,
          type: "friend_accepted",
          title: "Friend Request Accepted",
          message: "Your friend request was accepted!",
          related_user_id: currentUserId,
        })
      }
    } catch (error) {
      console.error("Error accepting friend request:", error)
    } finally {
      setLoading(null)
    }
  }

  const removeFriend = async (userId: string) => {
    setLoading(userId)
    try {
      const supabase = createClient()

      await supabase
        .from("friendships")
        .delete()
        .or(
          `and(requester_id.eq.${currentUserId},addressee_id.eq.${userId}),and(requester_id.eq.${userId},addressee_id.eq.${currentUserId})`,
        )

      setFriendships((prev) => {
        const updated = { ...prev }
        delete updated[userId]
        return updated
      })
    } catch (error) {
      console.error("Error removing friend:", error)
    } finally {
      setLoading(null)
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Trophy className="h-5 w-5 text-amber-500" />
    if (rank === 1) return <Trophy className="h-5 w-5 text-gray-400" />
    if (rank === 2) return <Trophy className="h-5 w-5 text-orange-600" />
    return null
  }

  const filteredLeaderboard = leaderboard.filter((user) =>
    user.display_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-2">
        {filteredLeaderboard.map((user, index) => {
          const originalIndex = leaderboard.findIndex((u) => u.id === user.id)
          const friendship = friendships[user.id]
          const badge = badgeMap[user.id]
          const isCurrentUser = currentUserId && user.id === currentUserId

          return (
            <div
              key={user.id}
              className={cn(
                "flex items-center gap-4 p-3 rounded-lg transition-colors",
                isCurrentUser ? "bg-primary/10 border border-primary/20" : "hover:bg-accent/50",
              )}
            >
              <div className="flex items-center justify-center w-8">
                {getRankIcon(originalIndex) || (
                  <span className="text-sm font-medium text-muted-foreground">#{originalIndex + 1}</span>
                )}
              </div>

              {profileRestricted ? (
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold shrink-0">
                    {user.display_name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn("font-medium truncate", isCurrentUser && "text-primary")}>
                        {user.display_name || "User"}
                        {isCurrentUser && " (You)"}
                      </span>
                      <VerifiedBadge isVerified={user.is_verified || false} className="h-4 w-4" />
                      {badge && (
                        <Badge variant="secondary" className="gap-1 shrink-0">
                          <Star className="h-3 w-3 text-amber-500" />
                          {badge.name}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{user.current_streak} day streak</p>
                  </div>
                </div>
              ) : (
                <Link
                  href={`/user/${user.id}`}
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:opacity-80"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold shrink-0">
                    {user.display_name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn("font-medium truncate", isCurrentUser && "text-primary")}>
                        {user.display_name || "User"}
                        {isCurrentUser && " (You)"}
                      </span>
                      <VerifiedBadge isVerified={user.is_verified || false} className="h-4 w-4" />
                      {badge && (
                        <Badge variant="secondary" className="gap-1 shrink-0">
                          <Star className="h-3 w-3 text-amber-500" />
                          {badge.name}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{user.current_streak} day streak</p>
                  </div>
                </Link>
              )}

              <div className="text-right">
                <p className="font-bold text-primary">{user.total_points}</p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>

              {currentUserId && !isCurrentUser && (
                <div className="ml-2">
                  {!friendship && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendFriendRequest(user.id)}
                      disabled={loading === user.id}
                      className="gap-1"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span className="hidden sm:inline">Add</span>
                    </Button>
                  )}
                  {friendship?.status === "pending" && friendship.isRequester && (
                    <Button variant="outline" size="sm" disabled className="gap-1 bg-transparent">
                      <Clock className="h-4 w-4" />
                      <span className="hidden sm:inline">Pending</span>
                    </Button>
                  )}
                  {friendship?.status === "pending" && !friendship.isRequester && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => acceptFriendRequest(user.id, friendship.id)}
                      disabled={loading === user.id}
                      className="gap-1"
                    >
                      <UserCheck className="h-4 w-4" />
                      <span className="hidden sm:inline">Accept</span>
                    </Button>
                  )}
                  {friendship?.status === "accepted" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => removeFriend(user.id)}
                      disabled={loading === user.id}
                      className="gap-1"
                    >
                      <UserMinus className="h-4 w-4" />
                      <span className="hidden sm:inline">Friends</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {filteredLeaderboard.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No users found matching "{searchQuery}"</div>
        )}
      </div>
    </div>
  )
}
