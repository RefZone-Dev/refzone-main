"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { formatTime, updateLawPerformance, updateDailyStreak, updateDailyActivityLog } from "@/lib/shared-utils"
import { useRouter } from "next/navigation"
import { Timer, Award, CheckCircle, XCircle, ArrowLeft, ArrowRight, FlaskConical } from "lucide-react"
import Link from "next/link"
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

  const handleSubmit = async () => {
    setIsLoading(true)

    // Always calculate results locally first so we can show them immediately
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
      questionResults.push({ questionId: question.id, isCorrect, pointsEarned })
    })

    const percentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0

    // Show results immediately
    setResults({ score: totalScore, totalPossible, percentage, questionResults })
    setIsCompleted(true)
    setIsLoading(false)

    if (percentage >= 70) {
      setShowCustomCelebration(true)
    }

    // Save to server in the background
    try {
      const saveResponse = await fetch("/api/quiz-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.id,
          answers,
          timeElapsed,
          questions: questions.map((q) => ({
            id: q.id,
            correct_answer: q.correct_answer,
            points_value: q.points_value,
            law_category: q.law_category,
            law_section: q.law_section,
          })),
        }),
      })
      if (!saveResponse.ok) {
        const errData = await saveResponse.json().catch(() => ({}))
        console.error("Failed to save quiz results:", saveResponse.status, errData)
      }
    } catch (error) {
      console.error("Failed to save quiz results:", error)
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
            const result = results.questionResults.find((r) => r.questionId === question.id) || results.questionResults[index]
            const correctAnswerArray = normalizeCorrectAnswer(question.correct_answer)
            const isCorrect = result?.isCorrect ?? false
            return (
              <Card
                key={question.id}
                className={
                  isCorrect
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
                        {!isCorrect && (
                          <p className="text-muted-foreground mt-2 italic">{question.explanation}</p>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-7 text-xs text-primary hover:text-primary/80 px-2"
                          asChild
                        >
                          <Link
                            href={`/decision-lab?q=${encodeURIComponent(
                              `I got this quiz question ${isCorrect ? 'correct' : 'wrong'}. Explain the rule in detail.\n\nQuestion: ${question.question_text}\nCorrect answer: ${correctAnswerArray.join(', ')}\nMy answer: ${answers[question.id]?.join(', ') || 'No answer'}\nExplanation given: ${question.explanation || 'None'}${question.law_category ? `\nLaw: ${question.law_category}${question.law_section ? ' — ' + question.law_section : ''}` : ''}`
                            )}`}
                          >
                            <FlaskConical className="h-3 w-3 mr-1" />
                            Learn more in Decision Lab
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="text-sm font-medium text-foreground">{result?.pointsEarned || 0} pts</span>
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
                {currentQuestion.options.map((option, index) => {
                  const isSelected = answers[currentQuestion.id]?.[0] === option
                  return (
                    <label
                      key={index}
                      htmlFor={`option-${index}`}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        isSelected ? "border-primary bg-primary/10" : "hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <span className="flex-1 text-foreground text-sm">
                        {option}
                      </span>
                    </label>
                  )
                })}
              </div>
            </RadioGroup>
          )}

          {currentQuestion.question_type === "multi_select" && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isChecked = answers[currentQuestion.id]?.includes(option) || false
                return (
                  <div
                    key={index}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      const currentAnswers = answers[currentQuestion.id] || []
                      if (isChecked) {
                        handleAnswerChange(currentQuestion.id, currentAnswers.filter((a) => a !== option))
                      } else {
                        handleAnswerChange(currentQuestion.id, [...currentAnswers, option])
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter") {
                        e.preventDefault()
                        const currentAnswers = answers[currentQuestion.id] || []
                        if (isChecked) {
                          handleAnswerChange(currentQuestion.id, currentAnswers.filter((a) => a !== option))
                        } else {
                          handleAnswerChange(currentQuestion.id, [...currentAnswers, option])
                        }
                      }
                    }}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      isChecked ? "border-primary bg-primary/10" : "hover:bg-muted/50"
                    }`}
                  >
                    <Checkbox
                      checked={isChecked}
                      tabIndex={-1}
                      className="pointer-events-none"
                    />
                    <span className="flex-1 text-foreground text-sm">
                      {option}
                    </span>
                  </div>
                )
              })}
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
