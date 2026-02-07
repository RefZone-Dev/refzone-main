"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { TutorialContextProvider } from "./tutorial-context"
import { InteractiveTutorialOverlay } from "./interactive-tutorial-overlay"

interface GlobalTutorialWrapperProps {
  children: React.ReactNode
}

export function GlobalTutorialWrapper({ children }: GlobalTutorialWrapperProps) {
  const [tutorialData, setTutorialData] = useState<{
    userId: string
    tutorialCompleted: boolean
    tutorialStep: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  // Once we know the tutorial is completed, never re-check
  const completedRef = useRef(false)

  useEffect(() => {
    const supabase = createClient()

    const fetchTutorialState = async () => {
      // If already marked completed locally, skip re-fetching
      if (completedRef.current) return

      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        setIsLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("tutorial_completed, tutorial_step")
        .eq("id", session.user.id)
        .single()

      if (profile) {
        if (profile.tutorial_completed) {
          completedRef.current = true
        }
        setTutorialData({
          userId: session.user.id,
          tutorialCompleted: profile.tutorial_completed ?? false,
          tutorialStep: profile.tutorial_step ?? 0,
        })
      }
      setIsLoading(false)
    }

    fetchTutorialState()

    // Listen for tutorial-completed event to set the local guard
    const handleTutorialCompleted = () => {
      completedRef.current = true
      setTutorialData((prev) =>
        prev ? { ...prev, tutorialCompleted: true, tutorialStep: 0 } : prev,
      )
    }
    window.addEventListener("tutorial-completed", handleTutorialCompleted)

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        fetchTutorialState()
      } else if (event === "SIGNED_OUT") {
        completedRef.current = false
        setTutorialData(null)
      }
      // Intentionally NOT re-fetching on TOKEN_REFRESHED to avoid re-triggering
    })

    return () => {
      subscription.unsubscribe()
      window.removeEventListener("tutorial-completed", handleTutorialCompleted)
    }
  }, [])

  // Don't wrap with tutorial if not logged in or still loading
  if (isLoading || !tutorialData) {
    return <>{children}</>
  }

  return (
    <TutorialContextProvider
      userId={tutorialData.userId}
      initialStep={tutorialData.tutorialStep}
      tutorialCompleted={tutorialData.tutorialCompleted}
    >
      {children}
      <InteractiveTutorialOverlay />
    </TutorialContextProvider>
  )
}
