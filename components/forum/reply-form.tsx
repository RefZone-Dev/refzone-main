"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send } from "lucide-react"

export function ReplyForm({ postId }: { postId: string }) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)

    try {
      const supabase = createClient()

      let user = null
      try {
        const { data } = await supabase.auth.getUser()
        user = data?.user
      } catch {
        // Auth error - redirect to login
      }

      if (!user) {
        router.push("/auth/login")
        return
      }

      await supabase.from("forum_replies").insert({
        post_id: postId,
        user_id: user.id,
        content: content.trim(),
      })

      setContent("")
      router.refresh()
    } catch (err) {
      console.error("Error posting reply:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-2 bg-card">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Post a Reply</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Share your thoughts or answer the question..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="resize-none bg-background text-foreground"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!content.trim() || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Reply
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
