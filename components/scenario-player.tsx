"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Timer, Award, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react"

import { getDifficultyColor, formatTime, updateDailyStreak } from "@/lib/shared-utils"
import { StreakCelebration } from "@/components/streak-celebration"
import { CustomCelebration } from "@/components/custom-celebration"
import { FeedbackCard } from "@/components/feedback-card"
import { UserFeedbackButton } from "@/components/user-feedback-button"

interface Scenario {
  id: string
  title: string
  ai_description: string | null
  difficulty: string
  scenario_type: string
  video_url: string | null
  ai_answer: string | null
  points_value: number
}

interface ScenarioPlayerProps {
  scenario: Scenario
  userId: string
}

export function ScenarioPlayer({ scenario, userId }: ScenarioPlayerProps) {
  const [userDecision, setUserDecision] = useState("")
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [result, setResult] = useState<{
    isCorrect: boolean
    pointsEarned: number
    aiValidation?: {
      confidence: number
      feedback: string
      matchesKeyPoints: string[]
    }
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [nextScenarioId, setNextScenarioId] = useState<string | null>(null)
  const [allCompleted, setAllCompleted] = useState(false)
  const router = useRouter()

  const [celebratingStreak, setCelebratingStreak] = useState<number | null>(null)
  const [showCustomCelebration, setShowCustomCelebration] = useState(false)

  useEffect(() => {
    if (!isSubmitted) {
      const interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isSubmitted])

  useEffect(() => {
    if (isSubmitted) {
      findNextScenario()
    }
  }, [isSubmitted])

  async function findNextScenario() {
    const supabase = createClient()

    // Get all active scenarios
    const { data: scenarios } = await supabase
      .from("scenarios")
      .select("id")
      .eq("is_active", true)
      .order("created_at", { ascending: true })

    // Get user's completed scenarios
    const { data: completedScenarios } = await supabase
      .from("scenario_responses")
      .select("scenario_id")
      .eq("user_id", userId)

    const completedIds = new Set(completedScenarios?.map((s) => s.scenario_id) || [])

    // Find the first incomplete scenario (excluding current)
    const nextIncomplete = scenarios?.find((s) => s.id !== scenario.id && !completedIds.has(s.id))

    if (nextIncomplete) {
      setNextScenarioId(nextIncomplete.id)
    } else {
      setAllCompleted(true)
    }
  }

  const handleSubmit = async () => {
    if (!userDecision.trim()) return

    setIsLoading(true)

    try {
      const aiCheckResponse = await fetch("/api/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAnswer: userDecision,
          correctAnswer: scenario.ai_answer || "",
          questionContext: `${scenario.title}: ${scenario.ai_description || ""}`,
        }),
      })

      const aiResult = await aiCheckResponse.json()
      const isCorrect = aiResult.isCorrect && aiResult.confidence >= 70

      const pointsEarned = isCorrect ? scenario.points_value : 0

      // Submit through API (uses service client to bypass RLS)
      try {
        await fetch("/api/scenario-submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scenarioId: scenario.id,
            userDecision,
            isCorrect,
            timeElapsed,
            pointsEarned,
            lawCategory: scenario.law_category,
            lawSection: scenario.law_section,
          }),
        })
      } catch (submitErr) {
        console.error("Failed to save scenario response:", submitErr)
      }

      setResult({
        isCorrect,
        pointsEarned,
        aiValidation: {
          confidence: aiResult.confidence,
          feedback: aiResult.feedback,
          matchesKeyPoints: aiResult.matchesKeyPoints || [],
        },
      })
      setIsSubmitted(true)

      if (isCorrect) {
        setShowCustomCelebration(true)
      }
    } catch {
      // submission failed
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextScenario = () => {
    if (nextScenarioId) {
      router.push(`/scenarios/${nextScenarioId}`)
    } else {
      router.push("/scenarios")
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <CustomCelebration show={showCustomCelebration} onComplete={() => setShowCustomCelebration(false)} />

      {celebratingStreak && (
        <StreakCelebration streakDays={celebratingStreak} onClose={() => setCelebratingStreak(null)} />
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" onClick={() => router.push("/scenarios")} className="cursor-pointer">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Scenarios
        </Button>
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <UserFeedbackButton contentType="scenario" contentId={scenario.id} contentTitle={scenario.title} />
          <Badge className={getDifficultyColor(scenario.difficulty)} variant="outline">
            {scenario.difficulty}
          </Badge>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground whitespace-nowrap">
            <Timer className="h-4 w-4" />
            {formatTime(timeElapsed)}
          </div>
        </div>
      </div>

      {/* Scenario Card */}
      <Card className="border-2 bg-card">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground">{scenario.title}</CardTitle>
          <Badge className="w-fit mt-2">{scenario.scenario_type}</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Video Player */}
          {scenario.video_url && (
            <div className="rounded-lg overflow-hidden border-2 border-border">
              <video
                src={scenario.video_url}
                controls
                className="w-full aspect-video bg-black"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {scenario.ai_description && (
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-gray-900 dark:text-gray-100 leading-relaxed">{scenario.ai_description}</p>
            </div>
          )}

          {!isSubmitted ? (
            <>
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Your Decision</label>
                <Textarea
                  placeholder="What would you call? Explain your decision and any cards you would show..."
                  value={userDecision}
                  onChange={(e) => setUserDecision(e.target.value)}
                  rows={5}
                  className="resize-none bg-background text-foreground border-input"
                />
                <p className="text-xs text-muted-foreground">
                  Be specific about your call and any disciplinary action required
                </p>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!userDecision.trim() || isLoading}
                className="w-full cursor-pointer"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Checking your answer...
                  </>
                ) : (
                  "Submit Decision"
                )}
              </Button>
            </>
          ) : (
            <>
              <FeedbackCard isCorrect={result?.isCorrect || false}>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {result?.isCorrect ? "Correct Decision!" : "Incorrect Decision"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {result?.isCorrect
                        ? `You earned ${result.pointsEarned} points`
                        : "Review the explanation below to learn"}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Your Decision:</p>
                      <p className="text-foreground">{userDecision}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Correct Answer:</p>
                      <p className="font-semibold text-foreground">{scenario.ai_answer}</p>
                    </div>
                  </div>
                </div>
              </FeedbackCard>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Timer className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time Taken</p>
                        <p className="text-xl font-bold text-foreground">{formatTime(timeElapsed)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Points</p>
                        <p className="text-xl font-bold text-foreground">{result?.pointsEarned || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => router.push("/scenarios")} className="flex-1 cursor-pointer">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to List
                </Button>
                {allCompleted ? (
                  <Button
                    onClick={() => router.push("/scenarios")}
                    className="flex-1 cursor-pointer"
                    variant="secondary"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    All Completed!
                  </Button>
                ) : (
                  <Button onClick={handleNextScenario} className="flex-1 cursor-pointer">
                    Next Scenario
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
