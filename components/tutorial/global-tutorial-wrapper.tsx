"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useAuth } from "@clerk/nextjs"
import { createClient } from "@/lib/supabase/client"
import { TutorialContextProvider } from "./tutorial-context"
import { InteractiveTutorialOverlay } from "./interactive-tutorial-overlay"

interface GlobalTutorialWrapperProps {
  children: React.ReactNode
}

export function GlobalTutorialWrapper({ children }: GlobalTutorialWrapperProps) {
  const { userId } = useAuth()
  const [tutorialData, setTutorialData] = useState<{
    userId: string
    tutorialCompleted: boolean
    tutorialStep: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  // Once we know the tutorial is completed, never re-check
  const completedRef = useRef(false)
  // Guard to prevent multiple fetch calls
  const fetchingRef = useRef(false)

  useEffect(() => {
    const supabase = createClient()

    const fetchTutorialState = async () => {
      // If already marked completed locally, skip re-fetching
      if (completedRef.current) return
      // Prevent multiple simultaneous fetches
      if (fetchingRef.current) return
      fetchingRef.current = true

      if (!userId) {
        setIsLoading(false)
        fetchingRef.current = false
        return
      }

      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("tutorial_completed, tutorial_step")
          .eq("id", userId)
          .maybeSingle()

        if (profile) {
          if (profile.tutorial_completed) {
            completedRef.current = true
          }
          setTutorialData({
            userId: userId,
            tutorialCompleted: profile.tutorial_completed ?? false,
            tutorialStep: profile.tutorial_step ?? 0,
          })
        }
      } catch {
        // Columns may not exist yet — ignore
      }
      setIsLoading(false)
      fetchingRef.current = false
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

    return () => {
      window.removeEventListener("tutorial-completed", handleTutorialCompleted)
    }
  }, [userId])

  return (
    <TutorialContextProvider
      userId={tutorialData?.userId ?? ""}
      initialStep={tutorialData?.tutorialStep ?? 0}
      tutorialCompleted={tutorialData?.tutorialCompleted ?? true}
      isReady={!isLoading && tutorialData !== null}
    >
      {children}
      {tutorialData && !tutorialData.tutorialCompleted && <InteractiveTutorialOverlay />}
    </TutorialContextProvider>
  )
}
