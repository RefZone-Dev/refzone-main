"use client"

import type React from "react"

interface DashboardWrapperProps {
  children: React.ReactNode
  hasSetGoals?: boolean
  currentScenarioGoal?: number
  currentQuizGoal?: number
}

export function DashboardWrapper({
  children,
}: DashboardWrapperProps) {
  return <>{children}</>
}
