"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Shield,
  Trash2,
  Lock,
  Unlock,
  Pin,
  PinOff,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Flag,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CustomModal } from "@/components/custom-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ForumPost {
  id: string
  title: string
  content: string
  category: string
  is_pinned: boolean
  is_locked: boolean
  view_count: number
  created_at: string
  moderation_status: string
  moderation_reason: string | null
  user_id: string
  author_name: string | null
}

interface ForumReport {
  id: string
  post_id: string
  reporter_id: string
  reason: string
  details: string | null
  status: string
  created_at: string
  post_title: string | null
  post_content: string | null
  reporter_name: string | null
}

export default function AdminModerationPage() {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [pendingPosts, setPendingPosts] = useState<ForumPost[]>([])
  const [reports, setReports] = useState<ForumReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")
  const router = useRouter()

  const [modal, setModal] = useState({
    isOpen: false,
    type: "info" as "success" | "error" | "warning" | "info" | "confirm",
    title: "",
    message: "",
    onConfirm: () => {},
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

      if (!profile?.is_admin) {
        router.push("/dashboard")
        return
      }

      // Fetch all posts
      const { data: allPosts, error: postsError } = await supabase
        .from("forum_posts")
        .select("*")
        .order("created_at", { ascending: false })

      if (postsError) {
        console.error("[v0] Error fetching posts:", postsError)
        setIsLoading(false)
        return
      }

      const { data: allReports, error: reportsError } = await supabase
        .from("forum_reports")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false })

      if (reportsError) {
        console.error("[v0] Error fetching reports:", reportsError)
      }

      if (!allPosts || allPosts.length === 0) {
        setPendingPosts([])
        setPosts([])
        setIsLoading(false)
        return
      }

      // Get unique user IDs from posts
      const userIds = [...new Set(allPosts.map((p) => p.user_id).filter(Boolean))]

      // Get unique user IDs from reports (reporters)
      const reporterIds = [...new Set(allReports?.map((r) => r.reporter_id).filter(Boolean) || [])]
      const allUserIds = [...new Set([...userIds, ...reporterIds])]

      // Fetch profiles separately
      const { data: profiles } =
        allUserIds.length > 0
          ? await supabase.from("profiles").select("id, display_name").in("id", allUserIds)
          : { data: [] }

      // Create profile map
      const profileMap = new Map()
      profiles?.forEach((p) => profileMap.set(p.id, p.display_name))

      // Create posts map for reports
      const postsMap = new Map()
      allPosts.forEach((p) => postsMap.set(p.id, p))

      // Enrich posts with author names
      const enrichedPosts: ForumPost[] = allPosts.map((post) => ({
        ...post,
        author_name: post.user_id ? profileMap.get(post.user_id) || "Unknown User" : "Deleted User",
      }))

      const enrichedReports: ForumReport[] = (allReports || []).map((report) => {
        const post = postsMap.get(report.post_id)
        return {
          ...report,
          post_title: post?.title || "Deleted Post",
          post_content: post?.content || "",
          reporter_name: report.reporter_id ? profileMap.get(report.reporter_id) || "Unknown User" : "Unknown User",
        }
      })

      // Separate pending and approved posts
      const pending = enrichedPosts.filter((p) => p.moderation_status === "pending_review")
      const approved = enrichedPosts.filter((p) => p.moderation_status !== "pending_review")

      setPendingPosts(pending)
      setPosts(approved)
      setReports(enrichedReports)
      setIsLoading(false)
    }

    fetchData()
  }, [router])

  const approvePost = async (postId: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from("forum_posts")
      .update({ moderation_status: "approved", moderation_reason: null })
      .eq("id", postId)

    if (error) {
      console.error("[v0] Error approving post:", error)
      setModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to approve post. Please try again.",
        onConfirm: () => setModal({ ...modal, isOpen: false }),
      })
      return
    }

    const post = pendingPosts.find((p) => p.id === postId)
    if (post) {
      setPendingPosts(pendingPosts.filter((p) => p.id !== postId))
      setPosts([{ ...post, moderation_status: "approved" }, ...posts])
    }

    setModal({
      isOpen: true,
      type: "success",
      title: "Post Approved",
      message: "The post is now visible to all users.",
      onConfirm: () => setModal({ ...modal, isOpen: false }),
    })
  }

  const rejectPost = async (postId: string) => {
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Reject Post",
      message: "This will permanently delete the post. The user will not be notified. Continue?",
      onConfirm: async () => {
        const supabase = createClient()
        const { error } = await supabase.from("forum_posts").delete().eq("id", postId)

        if (error) {
          console.error("[v0] Error deleting post:", error)
          setModal({
            isOpen: true,
            type: "error",
            title: "Error",
            message: "Failed to delete post. Please try again. " + error.message,
            onConfirm: () => setModal({ ...modal, isOpen: false }),
          })
          return
        }

        setPendingPosts(pendingPosts.filter((p) => p.id !== postId))
        setModal({
          isOpen: true,
          type: "success",
          title: "Post Rejected",
          message: "The post has been permanently deleted.",
          onConfirm: () => setModal({ ...modal, isOpen: false }),
        })
      },
    })
  }

  const togglePin = async (postId: string, currentPinned: boolean) => {
    const supabase = createClient()
    await supabase.from("forum_posts").update({ is_pinned: !currentPinned }).eq("id", postId)
    setPosts(posts.map((p) => (p.id === postId ? { ...p, is_pinned: !currentPinned } : p)))
  }

  const toggleLock = async (postId: string, currentLocked: boolean) => {
    const supabase = createClient()
    await supabase.from("forum_posts").update({ is_locked: !currentLocked }).eq("id", postId)
    setPosts(posts.map((p) => (p.id === postId ? { ...p, is_locked: !currentLocked } : p)))
  }

  const deletePost = async (postId: string) => {
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Delete Post",
      message: "Are you sure you want to delete this post? This action cannot be undone.",
      onConfirm: async () => {
        const supabase = createClient()
        await supabase.from("forum_posts").delete().eq("id", postId)
        setPosts(posts.filter((p) => p.id !== postId))
        setModal({ ...modal, isOpen: false })
      },
    })
  }

  const dismissReport = async (reportId: string) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase
      .from("forum_reports")
      .update({
        status: "dismissed",
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", reportId)

    if (error) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to dismiss report.",
        onConfirm: () => setModal({ ...modal, isOpen: false }),
      })
      return
    }

    setReports(reports.filter((r) => r.id !== reportId))
    setModal({
      isOpen: true,
      type: "success",
      title: "Report Dismissed",
      message: "The report has been dismissed.",
      onConfirm: () => setModal({ ...modal, isOpen: false }),
    })
  }

  const takeActionOnReport = async (reportId: string, postId: string) => {
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Delete Reported Post",
      message: "This will delete the reported post permanently. Continue?",
      onConfirm: async () => {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        // Delete the post
        await supabase.from("forum_posts").delete().eq("id", postId)

        // Mark report as reviewed
        await supabase
          .from("forum_reports")
          .update({
            status: "reviewed",
            reviewed_by: user?.id,
            reviewed_at: new Date().toISOString(),
          })
          .eq("id", reportId)

        // Remove from lists
        setReports(reports.filter((r) => r.id !== reportId))
        setPosts(posts.filter((p) => p.id !== postId))
        setPendingPosts(pendingPosts.filter((p) => p.id !== postId))

        setModal({
          isOpen: true,
          type: "success",
          title: "Post Deleted",
          message: "The reported post has been deleted.",
          onConfirm: () => setModal({ ...modal, isOpen: false }),
        })
      },
    })
  }

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      spam: "Spam or advertising",
      harassment: "Harassment or bullying",
      inappropriate: "Inappropriate content",
      misinformation: "Misinformation about Laws of the Game",
      other: "Other",
    }
    return labels[reason] || reason
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <CustomModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
      />

      <div className="flex items-center gap-4">
        <Button variant="outline" asChild className="cursor-pointer bg-transparent">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Forum Moderation</h1>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="pending" className="relative">
            <Clock className="h-4 w-4 mr-2" />
            Pending
            {pendingPosts.length > 0 && <Badge className="ml-2 bg-amber-500 text-white">{pendingPosts.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="reports" className="relative">
            <Flag className="h-4 w-4 mr-2" />
            Reports
            {reports.length > 0 && <Badge className="ml-2 bg-red-500 text-white">{reports.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="all">
            <Eye className="h-4 w-4 mr-2" />
            All Posts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                AI-Flagged Posts ({pendingPosts.length})
              </CardTitle>
              <CardDescription>
                These posts were flagged by AI moderation and need manual review before becoming visible
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center text-muted-foreground py-8">Loading posts...</p>
              ) : pendingPosts.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <p className="text-muted-foreground">No posts pending review</p>
                  <p className="text-sm text-muted-foreground mt-1">All clear!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 rounded-lg border border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className="font-medium">{post.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {post.category}
                            </Badge>
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending Review
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{post.content}</p>
                          {post.moderation_reason && (
                            <div className="flex items-start gap-2 text-xs bg-amber-100 dark:bg-amber-900/30 p-2 rounded mb-3">
                              <AlertTriangle className="h-3 w-3 text-amber-600 mt-0.5 flex-shrink-0" />
                              <span className="text-amber-800 dark:text-amber-200">
                                <strong>AI Reason:</strong> {post.moderation_reason}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>By {post.author_name}</span>
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => approvePost(post.id)}
                            className="cursor-pointer bg-green-50 border-green-200 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:border-green-800 dark:text-green-300"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => rejectPost(post.id)}
                            className="cursor-pointer"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-red-500" />
                User Reports ({reports.length})
              </CardTitle>
              <CardDescription>
                Posts reported by users for review. The posts remain visible until you take action.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center text-muted-foreground py-8">Loading reports...</p>
              ) : reports.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <p className="text-muted-foreground">No pending reports</p>
                  <p className="text-sm text-muted-foreground mt-1">All clear!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 rounded-lg border border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className="font-medium">{report.post_title}</span>
                            <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
                              <Flag className="h-3 w-3 mr-1" />
                              {getReasonLabel(report.reason)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{report.post_content}</p>
                          {report.details && (
                            <div className="flex items-start gap-2 text-xs bg-red-100 dark:bg-red-900/30 p-2 rounded mb-3">
                              <span className="text-red-800 dark:text-red-200">
                                <strong>Additional details:</strong> {report.details}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Reported by {report.reporter_name}</span>
                            <span>{new Date(report.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button variant="outline" size="sm" asChild className="cursor-pointer bg-transparent">
                            <Link href={`/forum/${report.post_id}`} target="_blank">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => dismissReport(report.id)}
                            className="cursor-pointer"
                          >
                            Dismiss
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => takeActionOnReport(report.id, report.post_id)}
                            className="cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* All posts tab */}
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Forum Posts ({posts.length})</CardTitle>
              <CardDescription>Moderate community posts - pin, lock, or delete content</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center text-muted-foreground py-8">Loading posts...</p>
              ) : (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <div key={post.id} className="p-4 rounded-lg border">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <Link href={`/forum/${post.id}`} className="font-medium hover:underline truncate">
                              {post.title}
                            </Link>
                            <Badge variant="outline" className="text-xs">
                              {post.category}
                            </Badge>
                            {post.is_pinned && (
                              <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
                                <Pin className="h-3 w-3 mr-1" />
                                Pinned
                              </Badge>
                            )}
                            {post.is_locked && (
                              <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
                                <Lock className="h-3 w-3 mr-1" />
                                Locked
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{post.content}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>By {post.author_name}</span>
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {post.view_count} views
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePin(post.id, post.is_pinned)}
                            className="cursor-pointer"
                          >
                            {post.is_pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleLock(post.id, post.is_locked)}
                            className="cursor-pointer"
                          >
                            {post.is_locked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deletePost(post.id)}
                            className="cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {posts.length === 0 && <p className="text-center text-muted-foreground py-8">No forum posts yet.</p>}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
