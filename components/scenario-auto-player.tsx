"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { getDifficultyColor, formatTime, updateLawPerformance, updateDailyStreak, updateDailyActivityLog } from "@/lib/shared-utils"
import { useRouter } from "next/navigation"
import { Timer, Award, ArrowLeft, ArrowRight, Loader2, X, Zap, RotateCcw } from "lucide-react"

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
  law_category?: string
  law_section?: string
}

interface ScenarioAutoPlayerProps {
  initialScenario: Scenario | null
  userId: string
  initialStreak: number
  longestStreak: number
  totalUnseen: number
}

export function ScenarioAutoPlayer({
  initialScenario,
  userId,
  initialStreak,
  longestStreak,
  totalUnseen,
}: ScenarioAutoPlayerProps) {
  const router = useRouter()
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(initialScenario)
  const [userDecision, setUserDecision] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [result, setResult] = useState<{
    isCorrect: boolean
    correctAnswer: string
    explanation: string
    pointsEarned: number
    accuracy: number
  } | null>(null)
  const [isLoadingNext, setIsLoadingNext] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [streak, setStreak] = useState(initialStreak)
  const [bestStreak, setBestStreak] = useState(longestStreak)
  const [remainingCount, setRemainingCount] = useState(totalUnseen)
  const [isGeneratingNew, setIsGeneratingNew] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [showCustomCelebration, setShowCustomCelebration] = useState(false)
  const [celebratingStreak, setCelebratingStreak] = useState(0)

  useEffect(() => {
    if (!isSubmitted && currentScenario) {
      const interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isSubmitted, currentScenario])

  const fetchNextScenario = useCallback(async () => {
    setIsLoadingNext(true)
    const supabase = createClient()

    const { data: scenarios } = await supabase.from("scenarios").select("*").eq("is_active", true)

    const { data: completedScenarios } = await supabase
      .from("scenario_responses")
      .select("scenario_id")
      .eq("user_id", userId)

    const completedIds = new Set(completedScenarios?.map((s) => s.scenario_id) || [])

    const unseenScenarios = scenarios?.filter((s) => !completedIds.has(s.id)) || []

    // Shuffle array using Fisher-Yates algorithm
    for (let i = unseenScenarios.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[unseenScenarios[i], unseenScenarios[j]] = [unseenScenarios[j], unseenScenarios[i]]
    }

    setRemainingCount(unseenScenarios.length)

    if (unseenScenarios.length > 0) {
      setCurrentScenario(unseenScenarios[0])
      setUserDecision("")
      setTimeElapsed(0)
      setIsSubmitted(false)
      setResult(null)
    } else {
      setCurrentScenario(null)
    }

    setIsLoadingNext(false)
  }, [userId])

  const handleSubmit = async () => {
    if (!userDecision.trim() || !currentScenario) return

    setIsLoadingNext(true)

    try {
      const aiCheckResponse = await fetch("/api/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAnswer: userDecision,
          correctAnswer: currentScenario.ai_answer || "",
          questionContext: `${currentScenario.title}: ${currentScenario.ai_description || ""}`,
        }),
      })

      const aiResult = await aiCheckResponse.json()
      const isCorrect = aiResult.isCorrect && aiResult.confidence >= 70

      const pointsEarned = isCorrect ? currentScenario.points_value : 0

      // Submit through API (uses service client to bypass RLS)
      try {
        const submitResponse = await fetch("/api/scenario-submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scenarioId: currentScenario.id,
            userDecision,
            isCorrect,
            timeElapsed,
            pointsEarned,
            lawCategory: currentScenario.law_category,
            lawSection: currentScenario.law_section,
          }),
        })

        const submitResult = await submitResponse.json()
        if (submitResult.success) {
          setStreak(submitResult.scenarioStreak)
          setBestStreak(submitResult.longestScenarioStreak)
        }
      } catch (submitErr) {
        console.error("Failed to save scenario response:", submitErr)
      }

      setResult({
        isCorrect: aiResult.isCorrect,
        correctAnswer: currentScenario.ai_answer || "",
        explanation: "",
        pointsEarned: pointsEarned,
        accuracy: aiResult.confidence,
      })
      setIsSubmitted(true)

      if (isCorrect) {
        setShowCustomCelebration(true)
      }

      setRemainingCount((prev) => Math.max(0, prev - 1))
    } catch {
    } finally {
      setIsLoadingNext(false)
    }
  }

  const generateNewScenario = async () => {
    setIsGeneratingNew(true)
    setGenerationError(null)

    try {
      const response = await fetch("/api/scenarios/auto-generate", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to generate scenario")
      }

      if (data.success && data.scenario) {
        setCurrentScenario(data.scenario)
        setRemainingCount(1)
        setUserDecision("")
        setTimeElapsed(0)
        setIsSubmitted(false)
        setResult(null)
      }
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "Failed to generate new scenario")
    } finally {
      setIsGeneratingNew(false)
    }
  }

  // No scenarios available state
  if (!currentScenario && !isLoadingNext) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-2 text-center">
          <CardContent className="py-16">
            {isGeneratingNew ? (
              <>
                <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
                <h2 className="text-3xl font-bold text-foreground mb-3">Generating New Scenario...</h2>
                <p className="text-muted-foreground mb-2">
                  {"You've completed all scenarios! We're creating a fresh one just for you."}
                </p>
                <p className="text-sm text-muted-foreground">This may take up to a minute...</p>
              </>
            ) : generationError ? (
              <>
                <X className="h-16 w-16 text-red-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-foreground mb-3">Generation Failed</h2>
                <p className="text-muted-foreground mb-4">{generationError}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button onClick={generateNewScenario} size="lg">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  <Button onClick={() => router.push("/dashboard")} variant="outline" size="lg">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Award className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-foreground mb-3">All Scenarios Completed!</h2>
                <p className="text-muted-foreground mb-2">{"You've completed all available scenarios. Great work!"}</p>
                <div className="flex items-center justify-center gap-2 text-lg font-semibold mb-6">
                  <Award className="h-5 w-5 text-orange-500" />
                  <span>Best Streak: {bestStreak} correct in a row</span>
                </div>
                <div className="flex items-center justify-center">
                  <Button onClick={() => router.push("/dashboard")} size="lg">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Scenario Streak Header */}
      <Card className="border-2 bg-gradient-to-r from-orange-500/10 to-red-500/10">
        <CardContent className="py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Award className="h-6 w-6 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Scenario Streak</p>
                  <p className="text-2xl font-bold text-foreground">{streak}</p>
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Best</p>
                  <p className="text-xl font-bold text-foreground">{bestStreak}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      {currentScenario && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <Badge className={getDifficultyColor(currentScenario.difficulty)} variant="outline">
              {currentScenario.difficulty}
            </Badge>
            <Badge>{currentScenario.scenario_type}</Badge>
            {currentScenario.law_category && (
              <Badge variant="outline" className="text-xs">
                {currentScenario.law_category}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <UserFeedbackButton
              contentType="scenario"
              contentId={currentScenario.id}
              contentTitle={currentScenario.title}
            />
            <div className="flex items-center gap-2 text-sm font-medium text-foreground whitespace-nowrap">
              <Timer className="h-4 w-4" />
              {formatTime(timeElapsed)}
            </div>
          </div>
        </div>
      )}

      {/* Scenario Card */}
      {currentScenario && (
        <Card className="border-2 bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">{currentScenario.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Video Player */}
            {currentScenario.video_url && (
              <div className="space-y-2">
                <div className="rounded-lg overflow-hidden border-2 border-border">
                  <video
                    src={currentScenario.video_url}
                    controls
                    controlsList="nodownload"
                    className="w-full aspect-video bg-black"
                    preload="metadata"
                    key={currentScenario.id}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Videos cannot be screen recorded or downloaded
                </p>
              </div>
            )}

            {currentScenario.ai_description && (
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-gray-900 dark:text-gray-100 leading-relaxed">{currentScenario.ai_description}</p>
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
                  disabled={!userDecision.trim() || isLoadingNext}
                  className="w-full cursor-pointer"
                  size="lg"
                >
                  {isLoadingNext ? (
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
                          ? `You earned ${result.pointsEarned} points • Streak: ${streak}`
                          : "Streak reset. Review the explanation below to learn"}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Your Decision:</p>
                        <p className="text-foreground">{userDecision}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Correct Decision:</p>
                        <p className="font-semibold text-foreground">{result?.correctAnswer}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Explanation:</p>
                        <p className="text-foreground">{result?.explanation}</p>
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
                  <Button variant="outline" onClick={() => router.push("/dashboard")} className="flex-1 cursor-pointer">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  {remainingCount > 0 ? (
                    <Button onClick={fetchNextScenario} disabled={isLoadingNext} className="flex-1 cursor-pointer">
                      {isLoadingNext ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          Next Scenario
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button onClick={generateNewScenario} className="flex-1 cursor-pointer" variant="secondary">
                      <Zap className="h-4 w-4 mr-2" />
                      Generate New Scenario
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Celebrations */}
      {showCustomCelebration && <CustomCelebration show={showCustomCelebration} onComplete={() => setShowCustomCelebration(false)} />}
      {celebratingStreak > 0 && (
        <StreakCelebration streakDays={celebratingStreak} onClose={() => setCelebratingStreak(0)} />
      )}

    </div>
  )
}
