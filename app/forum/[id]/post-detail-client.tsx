"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  ArrowLeft,
  Clock,
  Eye,
  MessageSquare,
  Star,
  CheckCircle2,
  MoreVertical,
  Trash2,
  Pencil,
  LogIn,
  UserX,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ReplyForm } from "@/components/forum/reply-form"
import { VoteButton } from "@/components/forum/vote-button"
import { ReportPostDialog } from "@/components/forum/report-post-dialog"
import { deletePost } from "@/app/forum/actions"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import { VerifiedBadge } from "@/components/verified-badge"

interface PostDetailClientProps {
  post: any
  replies: any[]
  postVoteCount: number
  userPostVote: number
  replyVoteMap: Record<string, number>
  userReplyVoteMap: Record<string, number>
  userBadgeMap: Record<string, any>
  currentUserId: string | null
  isLoggedIn: boolean
}

export function PostDetailClient({
  post,
  replies,
  postVoteCount,
  userPostVote,
  replyVoteMap,
  userReplyVoteMap,
  userBadgeMap,
  currentUserId,
  isLoggedIn,
}: PostDetailClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isDeleting, setIsDeleting] = useState(false)
  
  const loginUrl = `/auth/login?redirectTo=${encodeURIComponent(pathname)}`
  const signUpUrl = `/auth/sign-up?redirectTo=${encodeURIComponent(pathname)}`

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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isDeletedUser = post.user_id === null
  const postAuthorBadge = !isDeletedUser ? userBadgeMap[post.user_id] : null
  const isPostAuthor = currentUserId && post.user_id && currentUserId === post.user_id
  const canReport = isLoggedIn && currentUserId && post.user_id && currentUserId !== post.user_id

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      setIsDeleting(true)
      try {
        await deletePost(post.id)
        router.push("/forum")
      } catch (error) {
        console.error("Failed to delete post:", error)
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="outline" asChild>
        <Link href="/forum">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forum
        </Link>
      </Button>

      {!isLoggedIn && (
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-foreground mb-2">Join the Conversation</h3>
                <p className="text-muted-foreground">Sign up to reply, vote, and connect with fellow referees</p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <Button asChild>
                  <Link href={signUpUrl}>Sign Up Free</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={loginUrl}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Post */}
      <Card className="border-2 bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            {isLoggedIn ? (
              <VoteButton postId={post.id} currentVote={userPostVote} voteCount={postVoteCount} />
            ) : (
              <div className="flex flex-col items-center gap-1 text-center min-w-[60px]">
                <Button variant="ghost" size="icon" disabled className="opacity-50">
                  <span className="text-lg font-bold text-foreground">{postVoteCount}</span>
                </Button>
                <span className="text-xs text-muted-foreground">votes</span>
              </div>
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={getCategoryColor(post.category)}>{post.category}</Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(post.created_at)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    {post.view_count + 1} views
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {canReport && <ReportPostDialog postId={post.id} postTitle={post.title} />}
                  {isPostAuthor && isLoggedIn && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" disabled={isDeleting}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/forum/${post.id}/edit`} className="flex items-center gap-2 cursor-pointer">
                            <Pencil className="h-4 w-4" />
                            Edit Post
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={handleDelete}
                          className="text-red-600 dark:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Post
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-4">{post.title}</h1>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="border-t pt-4">
          <div className="flex items-center gap-3">
            {isDeletedUser ? (
              <>
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <UserX className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-muted-foreground italic">Deleted User</p>
                  <p className="text-sm text-muted-foreground">This user has deleted their account</p>
                </div>
              </>
            ) : (
              <>
                {postAuthorBadge && (
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: (postAuthorBadge.preview_data?.bgColor as string) || "#6366F1",
                    }}
                    title={postAuthorBadge.name}
                  >
                    <Star
                      className="h-4 w-4"
                      style={{ color: (postAuthorBadge.preview_data?.color as string) || "#fff" }}
                    />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <Link href={`/user/${post.user_id}`} className="font-medium text-foreground hover:text-primary hover:underline transition-colors">
                      {post.profiles?.display_name || "Anonymous"}
                    </Link>
                    <VerifiedBadge isVerified={post.profiles?.is_verified || false} className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-muted-foreground">{post.profiles?.total_points || 0} points</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {replies?.length || 0} Replies
        </h2>

        {replies?.map((reply) => {
          const isReplyDeletedUser = reply.user_id === null
          const replyBadge = !isReplyDeletedUser ? userBadgeMap[reply.user_id] : null
          return (
            <Card
              key={reply.id}
              className={`border-2 bg-card ${reply.is_accepted_answer ? "border-green-500 dark:border-green-400" : ""}`}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex gap-4">
                  {isLoggedIn ? (
                    <VoteButton
                      replyId={reply.id}
                      currentVote={userReplyVoteMap[reply.id] || 0}
                      voteCount={replyVoteMap[reply.id] || 0}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-center min-w-[60px]">
                      <Button variant="ghost" size="icon" disabled className="opacity-50">
                        <span className="text-lg font-bold text-foreground">{replyVoteMap[reply.id] || 0}</span>
                      </Button>
                      <span className="text-xs text-muted-foreground">votes</span>
                    </div>
                  )}
                  <div className="flex-1">
                    {reply.is_accepted_answer && (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-3">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">Accepted Answer</span>
                      </div>
                    )}
                    <p className="text-foreground whitespace-pre-wrap mb-4">{reply.content}</p>
                    <div className="flex items-center gap-3 pt-3 border-t">
                      {isReplyDeletedUser ? (
                        <>
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                            <UserX className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-muted-foreground italic">Deleted User</p>
                          </div>
                        </>
                      ) : (
                        <>
                          {replyBadge && (
                            <div
                              className="h-6 w-6 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: (replyBadge.preview_data?.bgColor as string) || "#6366F1",
                              }}
                            >
                              <Star
                                className="h-3 w-3"
                                style={{ color: (replyBadge.preview_data?.color as string) || "#fff" }}
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                              <Link href={`/user/${reply.user_id}`} className="text-sm font-medium text-foreground hover:text-primary hover:underline transition-colors">
                                {reply.profiles?.display_name || "Anonymous"}
                              </Link>
                              <VerifiedBadge
                                isVerified={reply.profiles?.is_verified || false}
                                className="h-3.5 w-3.5"
                              />
                            </div>
                          </div>
                        </>
                      )}
                      <p className="text-sm text-muted-foreground">{formatDate(reply.created_at)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {isLoggedIn ? (
          <ReplyForm postId={post.id} />
        ) : (
          <Card className="border-2 border-dashed bg-muted/20">
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Want to Reply?</h3>
              <p className="text-muted-foreground mb-4">Sign up to join the discussion and share your knowledge</p>
              <div className="flex gap-3 justify-center">
                <Button asChild>
                  <Link href={signUpUrl}>Create Account</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={loginUrl}>Sign In</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
