"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { getStepByNumber, getTotalSteps, type TutorialStep } from "@/lib/tutorial-steps"

interface TutorialContextType {
  isActive: boolean
  currentStep: TutorialStep | null
  stepNumber: number
  totalSteps: number
  nextStep: () => void
  prevStep: () => void
  skipTutorial: () => void
  completeTutorial: () => void
  startTutorial: () => void
}

const TutorialContext = createContext<TutorialContextType | null>(null)

export function useTutorial() {
  const context = useContext(TutorialContext)
  if (!context) {
    return {
      isActive: false,
      currentStep: null,
      stepNumber: 0,
      totalSteps: 0,
      nextStep: () => {},
      prevStep: () => {},
      skipTutorial: () => {},
      completeTutorial: () => {},
      startTutorial: () => {},
    }
  }
  return context
}

interface TutorialProviderProps {
  children: React.ReactNode
  userId: string
  initialStep: number
  tutorialCompleted: boolean
}

export function TutorialContextProvider({ children, userId, initialStep, tutorialCompleted }: TutorialProviderProps) {
  const [stepNumber, setStepNumber] = useState(initialStep)
  const [isActive, setIsActive] = useState(!tutorialCompleted && initialStep > 0)
  const [dashboardReady, setDashboardReady] = useState(false)
  // Guard flag: once tutorial is finished (skipped or completed), never re-activate in this session
  const finishedRef = useRef(tutorialCompleted)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleDashboardReady = () => {
      setDashboardReady(true)
    }

    window.addEventListener("dashboard-ready", handleDashboardReady)
    return () => window.removeEventListener("dashboard-ready", handleDashboardReady)
  }, [])

  // Start tutorial for new users - only after dashboard is ready, only once
  useEffect(() => {
    if (finishedRef.current) return
    if (!tutorialCompleted && initialStep === 0 && pathname === "/dashboard" && dashboardReady) {
      const timer = setTimeout(() => {
        if (finishedRef.current) return
        setStepNumber(1)
        setIsActive(true)
        updateStepInDatabase(1)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [tutorialCompleted, initialStep, pathname, dashboardReady])

  // Resume tutorial for users who left mid-tutorial
  useEffect(() => {
    if (finishedRef.current) return
    if (!tutorialCompleted && initialStep > 0 && pathname === "/dashboard" && dashboardReady && !isActive) {
      setIsActive(true)
    }
  }, [tutorialCompleted, initialStep, pathname, dashboardReady, isActive])

  const currentStep = getStepByNumber(stepNumber)
  const totalSteps = getTotalSteps()

  const updateStepInDatabase = async (step: number) => {
    await supabase.from("profiles").update({ tutorial_step: step }).eq("id", userId)
  }

  const finishTutorial = useCallback(async () => {
    // Set the guard immediately so no re-activation can happen
    finishedRef.current = true
    setIsActive(false)
    setStepNumber(0)

    // Persist to DB
    await supabase
      .from("profiles")
      .update({
        tutorial_completed: true,
        tutorial_step: 0,
      })
      .eq("id", userId)

    // Dispatch event to trigger goal modal
    window.dispatchEvent(new CustomEvent("tutorial-completed"))
  }, [userId, supabase])

  const nextStep = useCallback(async () => {
    const nextStepNumber = stepNumber + 1

    if (nextStepNumber > totalSteps) {
      await finishTutorial()
      return
    }

    // Verify the next step exists (handles any numbering gaps)
    const nextStepDef = getStepByNumber(nextStepNumber)
    if (!nextStepDef) {
      // No more valid steps, finish
      await finishTutorial()
      return
    }

    setStepNumber(nextStepNumber)
    await updateStepInDatabase(nextStepNumber)
  }, [stepNumber, totalSteps, finishTutorial])

  const prevStep = useCallback(async () => {
    if (stepNumber > 1) {
      const prevStepNumber = stepNumber - 1
      setStepNumber(prevStepNumber)
      await updateStepInDatabase(prevStepNumber)
    }
  }, [stepNumber])

  const skipTutorial = useCallback(async () => {
    await finishTutorial()
  }, [finishTutorial])

  const completeTutorial = useCallback(async () => {
    await finishTutorial()
  }, [finishTutorial])

  const startTutorial = useCallback(async () => {
    finishedRef.current = false
    setStepNumber(1)
    setIsActive(true)
    await updateStepInDatabase(1)
    router.push("/dashboard")
  }, [router])

  const effectiveIsActive = isActive && !finishedRef.current && (dashboardReady || pathname !== "/dashboard")

  return (
    <TutorialContext.Provider
      value={{
        isActive: effectiveIsActive,
        currentStep,
        stepNumber,
        totalSteps,
        nextStep,
        prevStep,
        skipTutorial,
        completeTutorial,
        startTutorial,
      }}
    >
      {children}
    </TutorialContext.Provider>
  )
}
