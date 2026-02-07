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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Flag, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface ReportPostDialogProps {
  postId: string
  postTitle: string
}

const REPORT_REASONS = [
  { value: "spam", label: "Spam or advertising" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "misinformation", label: "Misinformation about Laws of the Game" },
  { value: "other", label: "Other" },
]

export function ReportPostDialog({ postId, postTitle }: ReportPostDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [details, setDetails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("Please select a reason for reporting")
      return
    }

    setIsSubmitting(true)
    try {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        toast.error("You must be logged in to report a post")
        return
      }

      // Check if user already reported this post
      const { data: existingReport } = await supabase
        .from("forum_reports")
        .select("id")
        .eq("post_id", postId)
        .eq("reporter_id", user.id)
        .maybeSingle()

      if (existingReport) {
        toast.error("You have already reported this post")
        setOpen(false)
        return
      }

      // Create the report
      const { error: reportError } = await supabase.from("forum_reports").insert({
        post_id: postId,
        reporter_id: user.id,
        reason,
        details: details || null,
      })

      if (reportError) throw reportError

      // Notify all admins
      const { data: admins } = await supabase.from("profiles").select("id").eq("is_admin", true)

      if (admins && admins.length > 0) {
        const notifications = admins.map((admin) => ({
          user_id: admin.id,
          type: "report",
          title: "New Post Report",
          message: `A post "${postTitle.substring(0, 50)}${postTitle.length > 50 ? "..." : ""}" has been reported for: ${REPORT_REASONS.find((r) => r.value === reason)?.label || reason}`,
          link: `/admin/moderation`,
        }))

        await supabase.from("notifications").insert(notifications)
      }

      toast.success("Report submitted successfully. Admins will review it shortly.")
      setOpen(false)
      setReason("")
      setDetails("")
    } catch (error) {
      console.error("Error submitting report:", error)
      toast.error("Failed to submit report. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
          <Flag className="h-4 w-4 mr-2" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Post</DialogTitle>
          <DialogDescription>
            Help us keep the community safe. Reports are confidential and will be reviewed by our moderators.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-3">
            <Label>Why are you reporting this post?</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {REPORT_REASONS.map((r) => (
                <div key={r.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={r.value} id={r.value} />
                  <Label htmlFor={r.value} className="font-normal cursor-pointer">
                    {r.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="details">Additional details (optional)</Label>
            <Textarea
              id="details"
              placeholder="Provide any additional context that might help our moderators..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !reason}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
