"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Timer, Award, CheckCircle, XCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"

import { StreakCelebration } from "@/components/streak-celebration"
import { CustomCelebration } from "@/components/custom-celebration"
import { FeedbackCard } from "@/components/feedback-card"

interface Quiz {
  id: string
  title: string
  description: string
  difficulty: string
  time_limit_minutes: number | null
}

interface Question {
  id: string
  question_text: string
  question_type: string
  options: string[]
  correct_answer: string[] | string
  explanation: string
  points_value: number
  order_index: number
  law_category?: string
  law_section?: string
}

interface QuizPlayerProps {
  quiz: Quiz
  questions: Question[]
  userId: string
}

function normalizeCorrectAnswer(answer: string[] | string): string[] {
  if (Array.isArray(answer)) {
    return answer
  }
  if (typeof answer === "string") {
    try {
      const parsed = JSON.parse(answer)
      if (Array.isArray(parsed)) {
        return parsed
      }
    } catch {
      // Not JSON, treat as single answer
    }
    return [answer]
  }
  return []
}

export function QuizPlayer({ quiz, questions, userId }: QuizPlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [results, setResults] = useState<{
    score: number
    totalPossible: number
    percentage: number
    questionResults: Array<{ questionId: string; isCorrect: boolean; pointsEarned: number }>
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [celebratingStreak, setCelebratingStreak] = useState<number | null>(null)
  const [showCustomCelebration, setShowCustomCelebration] = useState(false)
  const router = useRouter()

  const currentQuestion = questions[currentQuestionIndex]

  useEffect(() => {
    if (!isCompleted) {
      const interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isCompleted])

  if (!questions || questions.length === 0) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-foreground">No Questions Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">This quiz doesn&apos;t have any questions yet.</p>
            <Button onClick={() => router.push("/quizzes")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quizzes
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: Array.isArray(value) ? value : [value],
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const updateLawPerformance = async (lawCategory: string, lawSection: string | null, isCorrect: boolean) => {
    const supabase = createClient()

    const { data: existing } = await supabase
      .from("user_law_performance")
      .select("*")
      .eq("user_id", userId)
      .eq("law_category", lawCategory)
      .eq("law_section", lawSection || "")
      .single()

    if (existing) {
      const newTotal = existing.total_attempts + 1
      const newCorrect = existing.correct_attempts + (isCorrect ? 1 : 0)
      const newAccuracy = (newCorrect / newTotal) * 100

      await supabase
        .from("user_law_performance")
        .update({
          total_attempts: newTotal,
          correct_attempts: newCorrect,
          accuracy: newAccuracy,
          last_attempt_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
    } else {
      await supabase.from("user_law_performance").insert({
        user_id: userId,
        law_category: lawCategory,
        law_section: lawSection || "",
        total_attempts: 1,
        correct_attempts: isCorrect ? 1 : 0,
        accuracy: isCorrect ? 100 : 0,
      })
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    const supabase = createClient()
    let totalScore = 0
    let totalPossible = 0
    const questionResults: Array<{ questionId: string; isCorrect: boolean; pointsEarned: number }> = []

    questions.forEach((question) => {
      totalPossible += question.points_value
      const userAnswer = answers[question.id] || []
      const correctAnswer = normalizeCorrectAnswer(question.correct_answer)

      const isCorrect =
        userAnswer.length === correctAnswer.length &&
        userAnswer.every((ans) => correctAnswer.includes(ans)) &&
        correctAnswer.every((ans) => userAnswer.includes(ans))

      const pointsEarned = isCorrect ? question.points_value : 0
      totalScore += pointsEarned

      questionResults.push({
        questionId: question.id,
        isCorrect,
        pointsEarned,
      })
    })

    const percentage = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0

    const { data: attempt } = await supabase
      .from("quiz_attempts")
      .insert({
        user_id: userId,
        quiz_id: quiz.id,
        score: totalScore,
        total_possible: totalPossible,
        percentage: percentage,
        time_taken_seconds: timeElapsed,
      })
      .select()
      .single()

    if (attempt) {
      const answerRecords = questionResults.map((result) => ({
        attempt_id: attempt.id,
        question_id: result.questionId,
        user_answer: answers[result.questionId] || [],
        is_correct: result.isCorrect,
        points_earned: result.pointsEarned,
      }))

      await supabase.from("quiz_answers").insert(answerRecords)

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i]
        const result = questionResults[i]
        if (question.law_category) {
          await updateLawPerformance(question.law_category, question.law_section || null, result.isCorrect)
        }
      }

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (profile) {
        const today = new Date().toISOString().split("T")[0]
        const lastActivity = profile.last_activity_date
        let newStreak = profile.current_streak || 0
        let longestStreak = profile.longest_streak || 0
        let streakContinued = false

        if (lastActivity) {
          const lastDate = new Date(lastActivity)
          const todayDate = new Date(today)
          const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

          if (diffDays === 1) {
            newStreak += 1
            streakContinued = true
          } else if (diffDays > 1) {
            newStreak = 1
          }
        } else {
          newStreak = 1
        }

        if (newStreak > longestStreak) {
          longestStreak = newStreak
        }

        const { data: existingLog } = await supabase
          .from("daily_activity_log")
          .select("*")
          .eq("user_id", userId)
          .eq("activity_date", today)
          .single()

        if (existingLog) {
          await supabase
            .from("daily_activity_log")
            .update({
              quizzes_completed: existingLog.quizzes_completed + 1,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingLog.id)
        } else {
          await supabase.from("daily_activity_log").insert({
            user_id: userId,
            activity_date: today,
            scenarios_completed: 0,
            quizzes_completed: 1,
          })
        }

        await supabase
          .from("profiles")
          .update({
            total_points: profile.total_points + totalScore,
            current_streak: newStreak,
            longest_streak: longestStreak,
            last_activity_date: today,
          })
          .eq("id", userId)

        if (streakContinued && newStreak > 1) {
          setCelebratingStreak(newStreak)
        }

      }
    }

    setResults({
      score: totalScore,
      totalPossible,
      percentage: Math.round(percentage),
      questionResults,
    })
    setIsCompleted(true)
    setIsLoading(false)

    if (percentage >= 70) {
      setShowCustomCelebration(true)
    }
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  if (isCompleted && results) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <CustomCelebration show={showCustomCelebration} onComplete={() => setShowCustomCelebration(false)} />

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push("/quizzes")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quizzes
          </Button>
        </div>

        <FeedbackCard isCorrect={results.percentage >= 70}>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {results.percentage >= 70 ? "Great Job!" : "Keep Practicing!"}
              </h2>
              <p className="text-sm text-muted-foreground">Quiz completed in {formatTime(timeElapsed)}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <div className="text-center p-3 md:p-4 rounded-lg bg-background/50 border">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Score</p>
                <p className="text-lg md:text-2xl font-bold text-foreground break-words">
                  {results.score}/{results.totalPossible}
                </p>
              </div>
              <div className="text-center p-3 md:p-4 rounded-lg bg-background/50 border">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Percentage</p>
                <p className="text-lg md:text-2xl font-bold text-foreground">{results.percentage}%</p>
              </div>
              <div className="text-center p-3 md:p-4 rounded-lg bg-background/50 border">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Correct</p>
                <p className="text-lg md:text-2xl font-bold text-foreground break-words">
                  {results.questionResults.filter((r) => r.isCorrect).length}/{questions.length}
                </p>
              </div>
            </div>
          </div>
        </FeedbackCard>

        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Question Breakdown</h3>
          {questions.map((question, index) => {
            const result = results.questionResults[index]
            const correctAnswerArray = normalizeCorrectAnswer(question.correct_answer)
            return (
              <Card
                key={question.id}
                className={
                  result.isCorrect
                    ? "border-2 border-green-500 bg-green-500/10 dark:bg-green-500/10"
                    : "border-2 border-red-500 bg-red-500/10 dark:bg-red-500/10"
                }
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-foreground mb-2">
                        {index + 1}. {question.question_text}
                      </p>
                      <div className="text-sm space-y-1">
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">Your answer:</span>{" "}
                          {answers[question.id]?.join(", ") || "No answer"}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">Correct answer:</span>{" "}
                          {correctAnswerArray.join(", ")}
                        </p>
                        {!result.isCorrect && (
                          <p className="text-muted-foreground mt-2 italic">{question.explanation}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="text-sm font-medium text-foreground">{result.pointsEarned} pts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.push("/quizzes")} className="flex-1">
            Back to Quizzes
          </Button>
          <Button onClick={() => (window.location.href = `/quizzes/${quiz.id}`)} className="flex-1">
            Retake Quiz
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {celebratingStreak && (
        <StreakCelebration streakDays={celebratingStreak} onClose={() => setCelebratingStreak(null)} />
      )}


      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push("/quizzes")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Exit Quiz
        </Button>
        <div className="flex items-center gap-2 mt-2">
          <Badge>{quiz.difficulty}</Badge>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Timer className="h-4 w-4" />
            {formatTime(timeElapsed)}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <p className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</p>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed text-foreground">{currentQuestion.question_text}</CardTitle>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="outline">{currentQuestion.question_type.replace("_", " ")}</Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Award className="h-4 w-4" />
              {currentQuestion.points_value} points
            </div>
            {currentQuestion.law_category && (
              <Badge variant="outline" className="text-xs">
                {currentQuestion.law_category}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {(currentQuestion.question_type === "multiple_choice" || currentQuestion.question_type === "true_false") && (
            <RadioGroup
              value={answers[currentQuestion.id]?.[0] || ""}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            >
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:bg-muted/50 transition-colors"
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-foreground">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {currentQuestion.question_type === "multi_select" && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={`option-${index}`}
                    checked={answers[currentQuestion.id]?.includes(option) || false}
                    onCheckedChange={(checked) => {
                      const currentAnswers = answers[currentQuestion.id] || []
                      if (checked) {
                        handleAnswerChange(currentQuestion.id, [...currentAnswers, option])
                      } else {
                        handleAnswerChange(
                          currentQuestion.id,
                          currentAnswers.filter((a) => a !== option),
                        )
                      }
                    }}
                  />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-foreground">
                    {option}
                  </Label>
                </div>
              ))}
              <p className="text-xs text-center text-muted-foreground">Select all that apply</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isLoading || Object.keys(answers).length !== questions.length}
                size="lg"
              >
                {isLoading ? "Submitting..." : "Submit Quiz"}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!answers[currentQuestion.id]}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {Object.keys(answers).length !== questions.length && (
            <p className="text-xs text-center text-muted-foreground">
              Answer all questions before submitting ({Object.keys(answers).length}/{questions.length} answered)
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
