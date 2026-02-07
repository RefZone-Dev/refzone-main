"use client"

import { useEffect, useState } from "react"
import { usePushNotifications } from "@/hooks/use-push-notifications"
import { useCapacitor } from "@/hooks/use-capacitor"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Bell, BellOff } from "lucide-react"

interface PushNotificationInitializerProps {
  userId: string
}

export function PushNotificationInitializer({ userId }: PushNotificationInitializerProps) {
  const { isNative, isReady } = useCapacitor()
  const [showPrompt, setShowPrompt] = useState(false)
  const [hasPrompted, setHasPrompted] = useState(false)
  
  const {
    isSupported,
    permission,
    isLoading,
    requestPermissionAndRegister,
  } = usePushNotifications({
    onNotificationReceived: (notification) => {
      // Show a toast when notification is received while app is open
      toast(notification.title, {
        description: notification.body,
      })
    },
  })

  // Show prompt for native apps that haven't been asked yet
  useEffect(() => {
    if (!isReady || !isNative || !isSupported || hasPrompted) return
    if (permission === 'granted') {
      // Already have permission, just register
      requestPermissionAndRegister()
      return
    }
    if (permission === 'default') {
      // Check if we've prompted before using localStorage
      const prompted = localStorage.getItem(`push_prompted_${userId}`)
      if (!prompted) {
        // Wait a bit before showing the prompt
        const timer = setTimeout(() => {
          setShowPrompt(true)
        }, 3000)
        return () => clearTimeout(timer)
      }
    }
  }, [isReady, isNative, isSupported, permission, userId, hasPrompted, requestPermissionAndRegister])

  const handleEnableNotifications = async () => {
    setShowPrompt(false)
    setHasPrompted(true)
    localStorage.setItem(`push_prompted_${userId}`, 'true')
    
    const result = await requestPermissionAndRegister()
    
    if (result.success) {
      toast.success("Notifications enabled", {
        description: "You'll receive updates about your training progress.",
      })
    } else {
      toast.error("Notifications not enabled", {
        description: "You can enable them later in Settings.",
      })
    }
  }

  const handleDecline = () => {
    setShowPrompt(false)
    setHasPrompted(true)
    localStorage.setItem(`push_prompted_${userId}`, 'true')
    toast.info("No problem!", {
      description: "You can enable notifications anytime in Settings.",
    })
  }

  // Only render for native apps
  if (!isNative) return null

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Bell className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center">Stay on Track</DialogTitle>
          <DialogDescription className="text-center">
            Get reminded to complete your daily training and stay up to date with forum activity.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          <div className="flex items-start gap-3 text-sm">
            <Bell className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <span>Daily training reminders at 5:00 PM</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <Bell className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <span>Replies to your forum posts</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <Bell className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <span>Likes on your contributions</span>
          </div>
        </div>
        <DialogFooter className="flex flex-col gap-2 sm:flex-col">
          <Button onClick={handleEnableNotifications} disabled={isLoading} className="w-full">
            {isLoading ? "Enabling..." : "Enable Notifications"}
          </Button>
          <Button variant="ghost" onClick={handleDecline} disabled={isLoading} className="w-full">
            <BellOff className="h-4 w-4 mr-2" />
            Not Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
