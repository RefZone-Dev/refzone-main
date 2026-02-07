"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, X, Smartphone } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { isCapacitor } from "@/lib/capacitor"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [tutorialDone, setTutorialDone] = useState(false)
  const [isNativeApp, setIsNativeApp] = useState(false)

  // Check if running in Capacitor native app - never show PWA prompt in native apps
  useEffect(() => {
    setIsNativeApp(isCapacitor())
  }, [])

  useEffect(() => {
    const handleTutorialCompleted = () => {
      setTutorialDone(true)
    }

    window.addEventListener("tutorial-completed", handleTutorialCompleted)

    return () => {
      window.removeEventListener("tutorial-completed", handleTutorialCompleted)
    }
  }, [])

  useEffect(() => {
    // Don't run any of this in native apps
    if (isNativeApp) return

    const checkInstallStatus = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      setUserId(user.id)

      // Check if user has already installed PWA
      const { data: profile } = await supabase
        .from("profiles")
        .select("pwa_installed, tutorial_completed")
        .eq("id", user.id)
        .single()

      if (profile?.pwa_installed) {
        return
      }

      if (profile?.tutorial_completed) {
        setTutorialDone(true)
      }

      // Check if already installed
      if (window.matchMedia("(display-mode: standalone)").matches) {
        // Mark as installed in database
        await supabase.from("profiles").update({ pwa_installed: true }).eq("id", user.id)
        return
      }
    }

    checkInstallStatus()

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  useEffect(() => {
    if (tutorialDone && userId) {
      // Show prompt after a short delay once tutorial is complete
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [tutorialDone, userId])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Fallback for iOS or unsupported browsers
      alert(
        "To install RefZone:\n\n" +
          "Safari (iOS): Tap the share button and select 'Add to Home Screen'\n\n" +
          "Chrome (Android): Tap the menu (⋮) and select 'Add to Home Screen' or 'Install App'",
      )
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted" && userId) {
      const supabase = createClient()
      await supabase.from("profiles").update({ pwa_installed: true }).eq("id", userId)
      setShowPrompt(false)
    }

    setDeferredPrompt(null)
  }

  const handleDismiss = async () => {
    setShowPrompt(false)
    // Don't mark as installed, so it shows again next time
  }

  // Never show in native apps or when not ready
  if (isNativeApp || !showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md animate-in slide-in-from-bottom-5">
      <Card className="border-2 border-amber-500 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900">
                <Smartphone className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Install RefZone</CardTitle>
                <CardDescription>Get the app experience</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-8 w-8 -mr-2 -mt-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Install RefZone for quick access, offline support, and a native app experience.
          </p>
          <div className="flex gap-2">
            <Button onClick={handleInstall} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Install App
            </Button>
            <Button variant="outline" onClick={handleDismiss}>
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
