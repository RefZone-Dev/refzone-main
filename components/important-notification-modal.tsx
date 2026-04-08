"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { useRouter } from "next/navigation"

interface ImportantNotification {
  id: string
  title: string
  message: string
}

export function ImportantNotificationModal() {
  const { userId } = useAuth()
  const [notification, setNotification] = useState<ImportantNotification | null>(null)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (userId) {
      checkForImportantNotifications(userId)
    }
  }, [userId])

  const checkForImportantNotifications = async (uid: string) => {
    try {
      const supabase = createClient()

      const { data: seenData } = await supabase
        .from("user_seen_important_notifications")
        .select("notification_id")
        .eq("user_id", uid)

      const seenIds = seenData?.map((s) => s.notification_id) || []

      let query = supabase
        .from("admin_notifications")
        .select("id, title, message")
        .order("created_at", { ascending: false })
        .limit(1)

      if (seenIds.length > 0) {
        query = query.not("id", "in", `(${seenIds.join(",")})`)
      }

      const { data: unseenNotifications } = await query

      if (unseenNotifications && unseenNotifications.length > 0) {
        setNotification(unseenNotifications[0])
        setOpen(true)
      }
    } catch {
      // Table may not exist yet — silently ignore
    }
  }

  const markAsSeen = async () => {
    if (!notification || !userId) return

    const supabase = createClient()
    await supabase.from("user_seen_important_notifications").insert({
      user_id: userId,
      notification_id: notification.id,
    })

    setOpen(false)
  }

  if (!notification) return null

  return (
    <Dialog open={open} onOpenChange={(open) => !open && markAsSeen()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <DialogTitle className="text-2xl">{notification.title}</DialogTitle>
          </div>
          <DialogDescription className="text-base leading-relaxed pt-2">{notification.message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button onClick={markAsSeen} className="w-full">
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
