"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Pin,
  ThumbsUp,
  Eye,
  Plus,
  Award,
  Star,
  LogIn,
  Search,
  UserX,
} from "lucide-react"
import { VerifiedBadge } from "@/components/verified-badge"

type ForumPost = {
  id: string
  user_id: string | null
  title: string
  content: string
  category: string
  is_pinned: boolean
  is_locked: boolean
  view_count: number
  created_at: string
  moderation_status: string
  profiles: {
    display_name: string
    total_points: number
    is_verified: boolean
  } | null
  reply_count: number
  vote_count: number
  user_badge?: {
    name: string
    preview_data: Record<string, unknown>
  } | null
}

const categories = [
  { id: "all", label: "All Posts", icon: MessageSquare },
  { id: "general", label: "General Discussion", icon: Users },
  { id: "rules", label: "Laws of the Game", icon: Award },
  { id: "scenarios", label: "Scenario Help", icon: TrendingUp },
  { id: "tips", label: "Tips & Advice", icon: Star },
]

interface ForumClientProps {
  posts: ForumPost[]
  userId: string | null
}

export function ForumClient({ posts, userId }: ForumClientProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.profiles?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      general: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      rules: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      scenarios: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      tips: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    }
    return colors[category] || "bg-muted text-muted-foreground"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-8">
      {!userId && (
        <Card className="border-2 border-primary/30 bg-white dark:bg-gray-800 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Join the RefZone Community</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Sign up to create posts, reply to discussions, and connect with fellow referees
                </p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <Button asChild className="shadow-md">
                  <Link href="/auth/sign-up">Sign Up Free</Link>
                </Button>
                <Button asChild variant="outline" className="shadow-sm text-foreground bg-background">
                  <Link href="/auth/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 dark:text-white text-foreground">Forum</h1>
          <p className="dark:text-gray-200 text-foreground">
            {userId
              ? "Ask questions, share knowledge, and connect with fellow referees"
              : "Browse discussions from referees worldwide"}
          </p>
        </div>
        {userId && (
          <Button asChild>
            <Link href="/forum/new">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Link>
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search posts by title, content, or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="flex items-center gap-2 data-[state=active]:bg-background"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{cat.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {categories.map((cat) => {
          const categoryPosts = cat.id === "all" ? filteredPosts : filteredPosts.filter((p) => p.category === cat.id)

          return (
            <TabsContent key={cat.id} value={cat.id} className="space-y-4">
              {categoryPosts.length === 0 ? (
                <Card className="border-2 bg-card">
                  <CardContent className="py-12 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {searchQuery ? "No posts found" : "No Posts Yet"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery ? "Try a different search term" : "Be the first to start a discussion!"}
                    </p>
                    {userId && !searchQuery && (
                      <Button asChild>
                        <Link href="/forum/new">Create Post</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                categoryPosts.map((post) => (
                  <Link key={post.id} href={`/forum/${post.id}`}>
                    <Card className="border-2 bg-card hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex gap-4">
                          <div className="hidden sm:flex flex-col items-center gap-1 text-center min-w-[60px]">
                            <ThumbsUp className="h-5 w-5 text-muted-foreground" />
                            <span className="text-lg font-bold text-foreground">{post.vote_count}</span>
                            <span className="text-xs text-muted-foreground">votes</span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-2 flex-wrap">
                              {post.is_pinned && <Pin className="h-4 w-4 text-yellow-500 flex-shrink-0" />}
                              <h3 className="text-lg font-semibold text-foreground line-clamp-1">{post.title}</h3>
                              {post.moderation_status === "pending_review" && (
                                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs">
                                  Pending Review
                                </Badge>
                              )}
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.content}</p>

                            <div className="flex flex-wrap items-center gap-3 text-sm">
                              <Badge className={getCategoryColor(post.category)}>{post.category}</Badge>

                              <div className="flex items-center gap-2">
                                {post.user_id === null ? (
                                  <>
                                    <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                                      <UserX className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                    <span className="text-muted-foreground italic">Deleted User</span>
                                  </>
                                ) : (
                                  <>
                                    {post.user_badge && (
                                      <div
                                        className="h-5 w-5 rounded-full flex items-center justify-center"
                                        style={{
                                          backgroundColor:
                                            (post.user_badge.preview_data?.bgColor as string) || "#6366F1",
                                        }}
                                      >
                                        <Star
                                          className="h-3 w-3"
                                          style={{
                                            color: (post.user_badge.preview_data?.color as string) || "#fff",
                                          }}
                                        />
                                      </div>
                                    )}
                                    <Link href={`/user/${post.user_id}`} className="text-muted-foreground hover:text-foreground hover:underline transition-colors" onClick={(e) => e.stopPropagation()}>
                                      {post.profiles?.display_name || "Anonymous"}
                                    </Link>
                                    <VerifiedBadge
                                      isVerified={post.profiles?.is_verified || false}
                                      className="h-3.5 w-3.5"
                                    />
                                  </>
                                )}
                              </div>

                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatDate(post.created_at)}
                              </div>

                              <div className="flex items-center gap-1 text-muted-foreground">
                                <MessageSquare className="h-3 w-3" />
                                {post.reply_count} replies
                              </div>

                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Eye className="h-3 w-3" />
                                {post.view_count} views
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
