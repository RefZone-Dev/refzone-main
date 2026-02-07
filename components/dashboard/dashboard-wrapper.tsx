"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { GoalSettingModal } from "@/components/dashboard/goal-setting-modal"
import { useTutorial } from "@/components/tutorial/tutorial-context"

interface DashboardWrapperProps {
  children: React.ReactNode
  hasSetGoals: boolean
  currentScenarioGoal: number
  currentQuizGoal: number
}

export function DashboardWrapper({
  children,
  hasSetGoals,
  currentScenarioGoal,
  currentQuizGoal,
}: DashboardWrapperProps) {
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [goals, setGoals] = useState({
    scenarios: currentScenarioGoal,
    quizzes: currentQuizGoal,
  })
  const { isActive: tutorialActive } = useTutorial()

  useEffect(() => {
    // Only show goal modal if tutorial is not active and user hasn't set goals
    if (!tutorialActive && !hasSetGoals) {
      setShowGoalModal(true)
    } else {
      setShowGoalModal(false)
    }
  }, [hasSetGoals, tutorialActive])

  useEffect(() => {
    const handleTutorialComplete = () => {
      // Show goal modal after tutorial completes
      if (!hasSetGoals) {
        setShowGoalModal(true)
      }
    }

    window.addEventListener("tutorial-completed", handleTutorialComplete)
    return () => window.removeEventListener("tutorial-completed", handleTutorialComplete)
  }, [hasSetGoals])

  const handleGoalSet = (scenarioGoal: number, quizGoal: number) => {
    setGoals({ scenarios: scenarioGoal, quizzes: quizGoal })
    setShowGoalModal(false)
  }

  return (
    <>
      <GoalSettingModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        onGoalSet={handleGoalSet}
        currentScenarioGoal={goals.scenarios}
        currentQuizGoal={goals.quizzes}
        isEditing={hasSetGoals}
      />
      {children}
    </>
  )
}
