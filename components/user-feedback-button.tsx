"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { MessageSquare, Loader2 } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { createClient } from "@/lib/supabase/client"

interface UserFeedbackButtonProps {
  contentType: "scenario" | "quiz" | "general" | "shop" | "forum"
  contentId?: string
  contentTitle?: string
}

export function UserFeedbackButton({ contentType, contentId, contentTitle }: UserFeedbackButtonProps) {
  const { userId } = useAuth()
  const [open, setOpen] = useState(false)
  const [feedbackType, setFeedbackType] = useState<string>("suggestion")
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!feedback.trim()) return

    setIsSubmitting(true)

    try {
      if (!userId) {
        alert("Please log in to submit feedback")
        return
      }

      const supabase = createClient()
      await supabase.from("user_feedback").insert({
        user_id: userId,
        feedback_type: feedbackType,
        related_id: contentId || null,
        feedback_text: feedback,
        rating: null,
      })

      setSubmitted(true)
      setTimeout(() => {
        setOpen(false)
        setSubmitted(false)
        setFeedback("")
        setFeedbackType("suggestion")
      }, 2000)
    } catch {
      // Silently handle
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer gap-2 bg-transparent">
          <MessageSquare className="h-4 w-4" />
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Feedback</DialogTitle>
          <DialogDescription>
            {contentTitle
              ? `Share your thoughts about "${contentTitle}"`
              : "Help us improve RefZone with your feedback"}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="text-4xl mb-2">✓</div>
            <p className="text-lg font-medium text-foreground">Thank you for your feedback!</p>
            <p className="text-sm text-muted-foreground">We appreciate you taking the time to help us improve.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Feedback Type</Label>
                <Select value={feedbackType} onValueChange={setFeedbackType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="suggestion">Suggestion</SelectItem>
                    <SelectItem value="bug">Bug Report</SelectItem>
                    <SelectItem value="content_issue">Content Issue</SelectItem>
                    <SelectItem value="praise">Praise</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Your Feedback</Label>
                <Textarea
                  placeholder="Tell us what you think..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!feedback.trim() || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
