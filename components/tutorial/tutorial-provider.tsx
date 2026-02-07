"use client"

import type React from "react"
import { TutorialContextProvider } from "./tutorial-context"
import { InteractiveTutorialOverlay } from "./interactive-tutorial-overlay"

interface TutorialProviderProps {
  userId: string
  tutorialCompleted: boolean
  tutorialStep: number
  children: React.ReactNode
}

export function TutorialProvider({ userId, tutorialCompleted, tutorialStep, children }: TutorialProviderProps) {
  return (
    <TutorialContextProvider userId={userId} initialStep={tutorialStep} tutorialCompleted={tutorialCompleted}>
      {children}
      <InteractiveTutorialOverlay />
    </TutorialContextProvider>
  )
}
