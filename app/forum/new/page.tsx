"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Send, Shield } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

const categories = [
  { id: "general", label: "General Discussion" },
  { id: "rules", label: "Laws of the Game" },
  { id: "scenarios", label: "Scenario Help" },
  { id: "tips", label: "Tips & Advice" },
]

export default function NewPostPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("general")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState("")
  const [pendingMessage, setPendingMessage] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/login")
          return
        }
        setIsAuthenticated(true)
      } catch (err) {
        console.error("[v0] Auth check failed:", err)
        router.push("/auth/login")
      }
    }
    checkAuth()
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setIsSubmitting(true)
    setIsChecking(true)
    setError("")
    setPendingMessage("")

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      let moderationStatus = "approved"
      let moderationReason: string | null = null

      try {
        const moderationResponse = await fetch("/api/moderation/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: title.trim(), content: content.trim() }),
        })

        if (moderationResponse.ok) {
          const moderationResult = await moderationResponse.json()
          moderationStatus = moderationResult.status
          moderationReason = moderationResult.reason
        }
      } catch (modError) {
        console.error("[v0] Moderation check failed, proceeding with post:", modError)
        // Continue with approved status if moderation fails
      }

      setIsChecking(false)

      const { data, error: insertError } = await supabase
        .from("forum_posts")
        .insert({
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
          category,
          moderation_status: moderationStatus,
          moderation_reason: moderationReason,
        })
        .select()
        .single()

      if (insertError) throw insertError

      if (moderationStatus === "pending_review") {
        setPendingMessage(
          "Your post has been submitted for review. Our moderation team will review it shortly. You can still view your post, but it won't be visible to others until approved.",
        )
        // Redirect after showing message
        setTimeout(() => {
          router.push(`/forum/${data.id}`)
        }, 3000)
        return
      }

      // Only send friend notifications for approved posts
      if (moderationStatus === "approved") {
        try {
          const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).single()

          const { data: friendships } = await supabase
            .from("friendships")
            .select("requester_id, addressee_id")
            .eq("status", "accepted")
            .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)

          if (friendships && friendships.length > 0) {
            const notifications = friendships.map((f) => {
              const friendId = f.requester_id === user.id ? f.addressee_id : f.requester_id
              return {
                user_id: friendId,
                type: "friend_post",
                title: "Friend Posted",
                message: `${profile?.display_name || "Your friend"} posted: "${title.trim().substring(0, 50)}${title.length > 50 ? "..." : ""}"`,
                link: `/forum/${data.id}`,
                related_user_id: user.id,
                related_post_id: data.id,
              }
            })

            await supabase.from("notifications").insert(notifications)
          }
        } catch (notifyError) {
          console.error("Error sending notifications:", notifyError)
        }
      }

      router.push(`/forum/${data.id}`)
    } catch (err) {
      console.error("Error creating post:", err)
      setError("Failed to create post. Please try again.")
    } finally {
      setIsSubmitting(false)
      setIsChecking(false)
    }
  }

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="outline" asChild>
        <Link href="/forum">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forum
        </Link>
      </Button>

      {pendingMessage && (
        <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
          <Shield className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">{pendingMessage}</AlertDescription>
        </Alert>
      )}

      <Card className="border-2 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Create New Post</CardTitle>
          <CardDescription>Ask a question or start a discussion with the community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-foreground">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground">
                Title
              </Label>
              <Input
                id="title"
                placeholder="What's your question or topic?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-background text-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-foreground">
                Content
              </Label>
              <Textarea
                id="content"
                placeholder="Provide details, context, or explain your question..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="resize-none bg-background text-foreground"
                required
              />
            </div>

            {error && <div className="text-sm text-red-500 dark:text-red-400">{error}</div>}

            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>
                Posts are reviewed by AI moderation to keep our community safe. Posts flagged for review will be checked
                by admins before becoming visible.
              </span>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" asChild className="flex-1 bg-transparent">
                <Link href="/forum">Cancel</Link>
              </Button>
              <Button type="submit" disabled={!title.trim() || !content.trim() || isSubmitting} className="flex-1">
                {isChecking ? (
                  <>
                    <Shield className="h-4 w-4 mr-2 animate-pulse" />
                    Checking...
                  </>
                ) : isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Post
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
