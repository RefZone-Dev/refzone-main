'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ScrollAnimate } from '@/components/marketing/scroll-animate'
import {
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Loader2,
  BookOpen,
  Clock,
  Trophy,
} from 'lucide-react'

interface Question {
  id: string
  question_text: string
  question_type: string
  options: string[]
  order_index: number
  law_category?: string
  law_section?: string
  points_value: number
}

interface Quiz {
  id: string
  title: string
  description: string
  difficulty: string
  time_limit_minutes: number | null
  created_at: string
}

interface QuestionResult {
  questionId: string
  questionText: string
  options: string[]
  userAnswer: string[]
  correctAnswer: string[]
  isCorrect: boolean
  explanation: string
  lawCategory?: string
  lawSection?: string
}

interface QuizResults {
  score: number
  totalPossible: number
  percentage: number
  correctCount: number
  totalQuestions: number
  results: QuestionResult[]
}

export function WeeklyQuizClient() {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState<QuizResults | null>(null)
  const [started, setStarted] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  // Fetch quiz
  useEffect(() => {
    fetch('/api/weekly-quiz')
      .then((res) => {
        if (!res.ok) throw new Error('No quiz available')
        return res.json()
      })
      .then((data) => {
        setQuiz(data.quiz)
        setQuestions(data.questions)
      })
      .catch(() => setError('No weekly quiz available right now. Check back soon!'))
      .finally(() => setLoading(false))
  }, [])

  // Timer
  useEffect(() => {
    if (!started || results) return
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(interval)
  }, [started, results])

  const handleSelect = (questionId: string, option: string, isMulti: boolean) => {
    setAnswers((prev) => {
      const current = prev[questionId] || []
      if (isMulti) {
        const next = current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option]
        return { ...prev, [questionId]: next }
      }
      return { ...prev, [questionId]: [option] }
    })
  }

  const handleSubmit = async () => {
    if (!quiz) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/weekly-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId: quiz.id, answers }),
      })
      const data = await res.json()
      setResults(data)
    } catch {
      setError('Failed to submit quiz. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  const answeredCount = Object.keys(answers).length
  const q = questions[currentQuestion]
  const isMulti = q?.question_type === 'multi_select'

  // Loading state
  if (loading) {
    return (
      <main className="px-9 pt-40 pb-20 md:pt-48">
        <div className="mx-auto max-w-3xl text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-400" />
          <p className="mt-4 text-white/45">Loading this week&apos;s quiz...</p>
        </div>
      </main>
    )
  }

  // Error / no quiz
  if (error || !quiz || questions.length === 0) {
    return (
      <main className="px-9 pt-40 pb-20 md:pt-48">
        <div className="mx-auto max-w-3xl text-center">
          <BookOpen className="mx-auto h-12 w-12 text-white/20" />
          <h1 className="mt-4 text-3xl font-bold text-white">Weekly Quiz</h1>
          <p className="mt-3 text-white/45">
            {error || 'No quiz available right now. Check back soon!'}
          </p>
          <Link
            href="/auth/sign-up"
            className="mt-8 inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
          >
            Sign up for RefZone
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    )
  }

  // Results screen
  if (results) {
    return (
      <main>
        <section className="relative overflow-hidden px-9 pt-40 pb-20 md:pt-48 md:pb-28">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-600/10 to-transparent blur-3xl" />
          </div>
          <div className="mx-auto max-w-3xl">
            <ScrollAnimate>
              <div className="text-center">
                <Trophy className="mx-auto h-14 w-14 text-pink-400" />
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
                  {results.percentage >= 80
                    ? 'Outstanding!'
                    : results.percentage >= 60
                      ? 'Well done!'
                      : 'Keep practising!'}
                </h1>
                <p className="mt-3 text-white/45">
                  You scored {results.correctCount} out of {results.totalQuestions} ({results.percentage}%) in {formatTime(elapsed)}
                </p>

                {/* Score ring */}
                <div className="mx-auto mt-8 w-fit">
                  <svg viewBox="0 0 120 120" className="h-32 w-32" aria-hidden="true">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r="52" fill="none"
                      stroke="url(#result-grad)"
                      strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={`${(results.percentage / 100) * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
                      transform="rotate(-90 60 60)"
                    />
                    <defs>
                      <linearGradient id="result-grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="relative -mt-[88px] flex items-center justify-center h-[56px]">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-3xl font-extrabold text-transparent">
                      {results.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </ScrollAnimate>

            {/* CTA to sign up */}
            <div className="mt-10 glass-card rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 text-center">
              <h2 className="text-xl font-bold text-white">Want to save your progress?</h2>
              <p className="mt-2 text-sm text-white/45">
                Create a free RefZone account to track your accuracy over time,
                get personalised recommendations, and access 500+ more questions.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
                >
                  Create free account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/auth/login"
                  className="text-sm text-white/45 hover:text-white transition-colors"
                >
                  Already have an account? Log in
                </Link>
              </div>
            </div>

            {/* Question review */}
            <div className="mt-10 space-y-4">
              <h3 className="text-lg font-semibold text-white">Question review</h3>
              {results.results.map((r, i) => (
                <div
                  key={r.questionId}
                  className={`rounded-xl border p-5 ${
                    r.isCorrect
                      ? 'border-emerald-500/20 bg-emerald-500/5'
                      : 'border-red-500/20 bg-red-500/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      r.isCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'
                    }`}>
                      {r.isCorrect
                        ? <Check className="h-3.5 w-3.5 text-emerald-400" />
                        : <X className="h-3.5 w-3.5 text-red-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">
                        {i + 1}. {r.questionText}
                      </p>
                      {!r.isCorrect && (
                        <p className="mt-1 text-xs text-red-400">
                          Your answer: {r.userAnswer.join(', ') || 'No answer'}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-emerald-400">
                        Correct: {r.correctAnswer.join(', ')}
                      </p>
                      <p className="mt-2 text-xs text-white/45 leading-relaxed">
                        {r.explanation}
                      </p>
                      {r.lawCategory && (
                        <span className="mt-2 inline-block rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-medium text-purple-400">
                          {r.lawCategory}{r.lawSection ? ` — ${r.lawSection}` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    )
  }

  // Start screen
  if (!started) {
    const weekOf = new Date(quiz.created_at).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

    return (
      <main>
        <section className="relative overflow-hidden px-9 pt-40 pb-20 md:pt-48 md:pb-28">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-600/10 to-transparent blur-3xl" />
          </div>
          <div className="mx-auto max-w-3xl text-center">
            <ScrollAnimate>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.05]">
                <BookOpen className="h-8 w-8 text-pink-400" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                Weekly Quiz
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-white/45">
                Test your Laws of the Game knowledge with this week&apos;s challenge.
                No sign-up required — just jump in and see how you go.
              </p>
            </ScrollAnimate>

            <div className="mx-auto mt-10 max-w-md glass-card rounded-2xl border border-white/10 bg-white/[0.05] p-8">
              <h2 className="text-xl font-bold text-white">{quiz.title}</h2>
              <p className="mt-2 text-sm text-white/45">{quiz.description}</p>

              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-white/45">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-purple-400" />
                  {questions.length} questions
                </span>
                {quiz.time_limit_minutes && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-pink-400" />
                    ~{quiz.time_limit_minutes} min
                  </span>
                )}
              </div>

              <p className="mt-4 text-xs text-white/20">Week of {weekOf}</p>

              <button
                onClick={() => setStarted(true)}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-white/85 text-black py-3 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
              >
                Start quiz
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </main>
    )
  }

  // Quiz in progress
  return (
    <main>
      <section className="px-9 pt-32 pb-20 md:pt-40">
        <div className="mx-auto max-w-2xl">
          {/* Progress header */}
          <div className="mb-8 flex items-center justify-between text-sm">
            <span className="text-white/45">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-white/45 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {formatTime(elapsed)}
              </span>
              {q?.law_category && (
                <span className="text-pink-400 text-xs font-medium">{q.law_category}</span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question card */}
          <div className="glass-card rounded-2xl border border-white/10 bg-white/[0.05] p-6 md:p-8">
            <h2 className="text-lg font-semibold text-white leading-relaxed">
              {q?.question_text}
            </h2>
            {isMulti && (
              <p className="mt-1 text-xs text-white/30">Select all that apply</p>
            )}

            <div className="mt-6 space-y-3">
              {q?.options.map((option, i) => {
                const selected = (answers[q.id] || []).includes(option)
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(q.id, option, isMulti)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                      selected
                        ? 'border-purple-500/50 bg-purple-500/10 text-white'
                        : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white/80'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-medium ${
                        selected
                          ? 'bg-purple-500/30 text-purple-300'
                          : 'bg-white/[0.06] text-white/30'
                      }`}
                    >
                      {selected ? <Check className="h-3 w-3" /> : String.fromCharCode(65 + i)}
                    </span>
                    <span>{option}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestion((c) => Math.max(0, c - 1))}
              disabled={currentQuestion === 0}
              className="flex items-center gap-1 text-sm text-white/45 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion((c) => c + 1)}
                className="flex items-center gap-1 text-sm text-white/45 hover:text-white transition-colors"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting || answeredCount < questions.length}
                className="inline-flex items-center gap-2 bg-white/85 text-black py-2 px-4 rounded-xl border border-white/20 hover:bg-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>Submit quiz</>
                )}
              </button>
            )}
          </div>

          {/* Question dots */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuestion(i)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  i === currentQuestion
                    ? 'bg-purple-500'
                    : answers[questions[i].id]
                      ? 'bg-purple-500/40'
                      : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          {answeredCount < questions.length && currentQuestion === questions.length - 1 && (
            <p className="mt-4 text-center text-xs text-white/30">
              Answer all {questions.length} questions to submit ({answeredCount}/{questions.length} answered)
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
