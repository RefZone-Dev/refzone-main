"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useTutorial } from "./tutorial-context"
import {
  X,
  ChevronRight,
  ChevronLeft,
  Target,
  BookOpen,
  FileText,
  MessageSquare,
  Award,
  User,
  Flame,
  Sparkles,
  Trophy,
  Clock,
  TrendingUp,
} from "lucide-react"

const stepIcons: Record<string, React.ReactNode> = {
  welcome: <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />,
  scenarios: <Target className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />,
  quizzes: <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />,
  "match-reports": <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />,
  "decision-lab": <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />,
  "daily-progress": <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />,
  "scenario-streak": <Flame className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />,
  "forum-section": <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />,
  "insights-section": <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />,
  "achievements-section": <Award className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />,
  leaderboard: <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />,
  settings: <User className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500" />,
  complete: <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />,
}

export function InteractiveTutorialOverlay() {
  const { isActive, currentStep, stepNumber, totalSteps, nextStep, prevStep, skipTutorial, completeTutorial } =
    useTutorial()

  const [highlightPosition, setHighlightPosition] = useState<DOMRect | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const updateHighlight = useCallback(() => {
    if (!currentStep) {
      setHighlightPosition(null)
      return
    }

    const selector =
      isMobile && currentStep.mobileTargetSelector ? currentStep.mobileTargetSelector : currentStep.targetSelector

    if (!selector) {
      setHighlightPosition(null)
      return
    }

    const element = document.querySelector(selector)
    if (element) {
      if (currentStep.scrollTo) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      setTimeout(
        () => {
          const rect = element.getBoundingClientRect()
          setHighlightPosition(rect)
        },
        currentStep.scrollTo ? 400 : 0,
      )
    } else {
      setHighlightPosition(null)
    }
  }, [currentStep, isMobile])

  useEffect(() => {
    if (!isActive) return

    updateHighlight()
    window.addEventListener("resize", updateHighlight)
    window.addEventListener("scroll", updateHighlight)

    const timer = setTimeout(updateHighlight, 100)
    const timer2 = setTimeout(updateHighlight, 500)

    return () => {
      window.removeEventListener("resize", updateHighlight)
      window.removeEventListener("scroll", updateHighlight)
      clearTimeout(timer)
      clearTimeout(timer2)
    }
  }, [updateHighlight, isActive, stepNumber, isMobile])

  if (!isActive || !currentStep) return null

  const isCorrectPage = pathname === currentStep.page || pathname.startsWith(currentStep.page)
  if (!isCorrectPage) return null

  const handleNext = () => {
    if (currentStep.id === "complete") {
      completeTutorial()
    } else {
      nextStep()
    }
  }

  const getCardPosition = (): React.CSSProperties => {
    const viewportHeight = window.innerHeight
    const cardHeight = 280
    const navbarHeight = 80
    const padding = 12

    if (currentStep.position === "above-navbar" && isMobile) {
      return {
        bottom: navbarHeight + padding,
        left: "50%",
        transform: "translateX(-50%)",
        top: "auto",
      }
    }

    if (!highlightPosition || currentStep.position === "center") {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }
    }

    const spaceAbove = highlightPosition.top
    const spaceBelow = viewportHeight - highlightPosition.bottom - (isMobile ? navbarHeight : 0)

    let top: number

    if (spaceBelow >= cardHeight + padding) {
      top = highlightPosition.bottom + padding
    } else if (spaceAbove >= cardHeight + padding) {
      top = highlightPosition.top - cardHeight - padding
    } else {
      if (spaceBelow > spaceAbove) {
        top = viewportHeight - cardHeight - padding - (isMobile ? navbarHeight : 0)
      } else {
        top = padding
      }
    }

    const minTop = padding
    const maxTop = viewportHeight - cardHeight - padding - (isMobile ? navbarHeight : 0)
    top = Math.max(minTop, Math.min(top, maxTop))

    return {
      top,
      left: "50%",
      transform: "translateX(-50%)",
    }
  }

  const cardStyle = getCardPosition()
  const icon = stepIcons[currentStep.id] || <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div className="absolute inset-0 bg-black/60 pointer-events-auto" />

      {highlightPosition && (
        <div
          className="absolute bg-transparent ring-4 ring-primary ring-offset-4 ring-offset-transparent rounded-xl z-[101] transition-all duration-300"
          style={{
            top: highlightPosition.top - 8,
            left: highlightPosition.left - 8,
            width: highlightPosition.width + 16,
            height: highlightPosition.height + 16,
          }}
        />
      )}

      <Card
        className="absolute z-[102] w-[92vw] max-w-[380px] shadow-2xl border-2 border-primary/20 pointer-events-auto"
        style={cardStyle}
      >
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-foreground leading-tight">{currentStep.title}</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Step {stepNumber} of {totalSteps}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={skipTutorial}
              className="h-7 w-7 sm:h-8 sm:w-8 -mt-1 -mr-1 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">{currentStep.description}</p>

          <div className="flex items-center justify-center gap-1 mb-3 flex-wrap">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index < stepNumber - 1
                    ? "w-1.5 bg-primary/50"
                    : index === stepNumber - 1
                      ? "w-4 bg-primary"
                      : "w-1.5 bg-muted"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-1 sm:gap-2">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={stepNumber === 1}
              className="gap-1 bg-transparent text-[10px] sm:text-xs px-2 sm:px-3 h-8"
              size="sm"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              Back
            </Button>

            <Button
              variant="ghost"
              onClick={skipTutorial}
              className="text-muted-foreground text-[10px] sm:text-xs px-2 sm:px-3 h-8"
              size="sm"
            >
              Skip Tutorial
            </Button>

            <Button onClick={handleNext} className="gap-1 text-[10px] sm:text-xs px-2 sm:px-3 h-8" size="sm">
              {currentStep.id === "complete" ? "Finish" : "Next"}
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
