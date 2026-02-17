import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BookOpen, Clock } from "lucide-react"
import { checkFeatureClosure } from "@/lib/feature-closures"
import { FeatureClosure } from "@/components/ui/feature-closure"

export default async function QuizzesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Check if quizzes are closed
  const closure = await checkFeatureClosure('quizzes')
  if (closure) {
    return <FeatureClosure closure={closure} />
  }

  // Fetch quizzes and attempts in parallel
  const [quizzesResult, attemptsResult] = await Promise.all([
    supabase.from("quizzes").select("*").eq("is_active", true).order("difficulty"),
    supabase.from("quiz_attempts").select("quiz_id, percentage").eq("user_id", user.id),
  ])

  const quizzes = quizzesResult.data
  const attempts = attemptsResult.data

  // Get best scores for each quiz
  const bestScores = new Map()
  attempts?.forEach((attempt) => {
    const current = bestScores.get(attempt.quiz_id)
    if (!current || attempt.percentage > current) {
      bestScores.set(attempt.quiz_id, attempt.percentage)
    }
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800"
      case "hard":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Knowledge Quizzes</h1>
        <p className="text-muted-foreground">Test your understanding of Laws of the Game</p>
      </div>

      {/* Quizzes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes?.map((quiz) => {
          const bestScore = bestScores.get(quiz.id)
          const hasAttempted = bestScore !== undefined

          return (
            <Card
              key={quiz.id}
              className={`border-2 hover:shadow-lg transition-shadow ${hasAttempted ? "bg-muted/50" : ""}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge className={getDifficultyColor(quiz.difficulty)} variant="outline">
                    {quiz.difficulty}
                  </Badge>
                  {quiz.time_limit_minutes && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {quiz.time_limit_minutes}m
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg leading-tight text-foreground">{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{quiz.description}</p>

                {hasAttempted && (
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Best Score</span>
                      <span className="text-lg font-bold text-blue-700 dark:text-blue-400">{bestScore}%</span>
                    </div>
                  </div>
                )}

                <Button asChild className="w-full">
                  <Link href={`/quizzes/${quiz.id}`}>{hasAttempted ? "Retake Quiz" : "Start Quiz"}</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {(!quizzes || quizzes.length === 0) && (
        <Card className="border-2">
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Quizzes Available</h3>
            <p className="text-muted-foreground">Check back soon for new quizzes!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
