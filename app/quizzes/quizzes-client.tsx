"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BookOpen, Clock, Filter, CheckCircle, ChevronDown, Search, Shuffle } from "lucide-react"
import { useRouter } from "next/navigation"
import { getDifficultyColor } from "@/lib/shared-utils"

interface Quiz {
  id: string
  title: string
  description: string
  difficulty: string
  time_limit_minutes: number | null
  created_at: string
  questionCount: number
  lawCategories: string[]
}

interface QuizzesClientProps {
  quizzes: Quiz[]
  bestScores: Record<string, number>
}

type LengthFilter = "all" | "short" | "mid" | "long"
type DifficultyFilter = "all" | "easy" | "medium" | "hard"

export function QuizzesClient({ quizzes, bestScores }: QuizzesClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showCompleted, setShowCompleted] = useState(false)
  const [lawFilter, setLawFilter] = useState("all")
  const [lengthFilter, setLengthFilter] = useState<LengthFilter>("all")
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Read search param from URL (e.g. from dashboard Practice links)
  useEffect(() => {
    const q = searchParams.get("search")
    if (q) {
      setSearchQuery(q)
      setShowCompleted(true) // Show all quizzes when searching
    }
  }, [searchParams])

  // Collect all unique law categories across quizzes
  const allLaws = useMemo(() => {
    const laws = new Set<string>()
    quizzes.forEach((q) => q.lawCategories.forEach((l) => laws.add(l)))
    return [...laws].sort()
  }, [quizzes])

  const completedIds = new Set(Object.keys(bestScores))

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchesTitle = quiz.title.toLowerCase().includes(q)
        const matchesDesc = quiz.description?.toLowerCase().includes(q)
        const matchesLaw = quiz.lawCategories.some((l) => l.toLowerCase().includes(q))
        if (!matchesTitle && !matchesDesc && !matchesLaw) return false
      }

      // Completed filter
      const isCompleted = completedIds.has(quiz.id)
      if (!showCompleted && isCompleted) return false

      // Law filter
      if (lawFilter !== "all") {
        if (!quiz.lawCategories.includes(lawFilter)) return false
      }

      // Length filter
      if (lengthFilter !== "all") {
        if (lengthFilter === "short" && quiz.questionCount > 5) return false
        if (lengthFilter === "mid" && (quiz.questionCount <= 5 || quiz.questionCount > 10)) return false
        if (lengthFilter === "long" && quiz.questionCount <= 10) return false
      }

      // Difficulty filter
      if (difficultyFilter !== "all" && quiz.difficulty !== difficultyFilter) return false

      return true
    })
  }, [quizzes, showCompleted, lawFilter, lengthFilter, difficultyFilter, completedIds, searchQuery])

  const completedCount = quizzes.filter((q) => completedIds.has(q.id)).length
  const hasActiveFilters = lawFilter !== "all" || lengthFilter !== "all" || difficultyFilter !== "all" || searchQuery !== ""

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Knowledge Quizzes</h1>
          <p className="text-sm text-muted-foreground">
            {quizzes.length} quizzes · {completedCount} completed
          </p>
        </div>
        <Button
          size="lg"
          className="shrink-0 gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/20"
          onClick={() => {
            const uncompleted = quizzes.filter((q) => !completedIds.has(q.id))
            const pool = uncompleted.length > 0 ? uncompleted : quizzes
            if (pool.length > 0) {
              const random = pool[Math.floor(Math.random() * pool.length)]
              router.push(`/quizzes/${random.id}`)
            }
          }}
        >
          <Shuffle className="h-4 w-4" />
          Random Quiz
        </Button>
      </div>

      {/* Search & Filter bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search quizzes by topic, law, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border bg-background pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Show completed toggle */}
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              showCompleted
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-border bg-background text-muted-foreground hover:bg-accent"
            }`}
          >
            <CheckCircle className="h-3.5 w-3.5" />
            {showCompleted ? "Showing completed" : "Show completed"}
            {completedCount > 0 && (
              <span className="rounded-full bg-muted px-1.5 text-[10px]">{completedCount}</span>
            )}
          </button>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              hasActiveFilters
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:bg-accent"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
            {hasActiveFilters && (
              <span className="rounded-full bg-primary/20 px-1.5 text-[10px]">
                {[lawFilter !== "all", lengthFilter !== "all", difficultyFilter !== "all"].filter(Boolean).length}
              </span>
            )}
            <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                setLawFilter("all")
                setLengthFilter("all")
                setDifficultyFilter("all")
                setSearchQuery("")
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Expanded filter options */}
        {showFilters && (
          <div className="rounded-lg border bg-card p-4 space-y-4">
            {/* Difficulty */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Difficulty</p>
              <div className="flex flex-wrap gap-1.5">
                {(["all", "easy", "medium", "hard"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficultyFilter(d)}
                    className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                      difficultyFilter === d
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {d === "all" ? "All" : d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Length */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Length</p>
              <div className="flex flex-wrap gap-1.5">
                {([
                  { value: "all", label: "All" },
                  { value: "short", label: "Short (1-5)" },
                  { value: "mid", label: "Mid (6-10)" },
                  { value: "long", label: "Long (11+)" },
                ] as const).map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLengthFilter(l.value)}
                    className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                      lengthFilter === l.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Law category */}
            {allLaws.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Law</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setLawFilter("all")}
                    className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                      lawFilter === "all"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    All
                  </button>
                  {allLaws.map((law) => (
                    <button
                      key={law}
                      onClick={() => setLawFilter(law)}
                      className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                        lawFilter === law
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {law}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quizzes Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredQuizzes.map((quiz) => {
          const bestScore = bestScores[quiz.id]
          const isCompleted = bestScore !== undefined
          const lengthLabel = quiz.questionCount <= 5 ? "Short" : quiz.questionCount <= 10 ? "Mid" : "Long"

          return (
            <Card
              key={quiz.id}
              className={`border hover:shadow-md transition-shadow relative ${
                isCompleted ? "border-emerald-500/20 bg-emerald-500/[0.02]" : ""
              }`}
            >
              {isCompleted && (
                <div className="absolute top-3 right-3">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                  <Badge className={getDifficultyColor(quiz.difficulty)} variant="outline">
                    {quiz.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-normal">
                    {quiz.questionCount} Qs · {lengthLabel}
                  </Badge>
                  {quiz.time_limit_minutes && (
                    <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" />
                      {quiz.time_limit_minutes}m
                    </span>
                  )}
                </div>
                <CardTitle className="text-base leading-tight text-foreground">{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <p className="text-xs text-muted-foreground line-clamp-2">{quiz.description}</p>

                {quiz.lawCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {quiz.lawCategories.slice(0, 3).map((law) => (
                      <span
                        key={law}
                        className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {law}
                      </span>
                    ))}
                    {quiz.lawCategories.length > 3 && (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        +{quiz.lawCategories.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {isCompleted && (
                  <div className="flex items-center justify-between rounded-md bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5">
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Best</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{Math.round(bestScore)}%</span>
                  </div>
                )}

                <Button asChild size="sm" className="w-full" variant={isCompleted ? "outline" : "default"}>
                  <Link href={`/quizzes/${quiz.id}`}>
                    {isCompleted ? "Retake Quiz" : "Start Quiz"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredQuizzes.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            {hasActiveFilters || !showCompleted ? (
              <>
                <h3 className="font-semibold text-foreground mb-1">No matching quizzes</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters
                  {!showCompleted && completedCount > 0 && " or toggle 'Show completed'"}
                </p>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-foreground mb-1">No Quizzes Available</h3>
                <p className="text-sm text-muted-foreground">Check back soon for new quizzes!</p>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
