"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Target, TrendingUp, Flame, BarChart3, BookOpen, Star, TrendingDown, Loader2 } from "lucide-react"
import { DashboardWrapper } from "./dashboard-wrapper"
import { PerformanceChart, LawBreakdownChart } from "./performance-chart"
import { createClient } from "@/lib/supabase/client"
import { useTutorial } from "@/components/tutorial/tutorial-context"

const LAW_NAMES: Record<string, string> = {
  "Law 1": "The Field of Play", "Law 2": "The Ball", "Law 3": "The Players",
  "Law 4": "The Players' Equipment", "Law 5": "The Referee", "Law 6": "The Other Match Officials",
  "Law 7": "The Duration of the Match", "Law 8": "The Start and Restart of Play",
  "Law 9": "The Ball In and Out of Play", "Law 10": "Determining the Outcome",
  "Law 11": "Offside", "Law 12": "Fouls and Misconduct", "Law 13": "Free Kicks",
  "Law 14": "The Penalty Kick", "Law 15": "The Throw-In", "Law 16": "The Goal Kick",
  "Law 17": "The Corner Kick",
}

function getLawDisplayName(lawCategory: string, lawSection?: string): string {
  if (lawSection && lawSection !== "") return lawSection
  return LAW_NAMES[lawCategory] || lawCategory
}

interface DashboardContentProps {
  profile: any
  todayActivity: any
  scenarioAccuracy: number
  quizAccuracy: number
  forumPosts: any[]
  lawPerformance: any[]
  recentResponses: any[]
  totalScenarios: number
  totalQuizzes: number
  activeDays: string[]
}

export function DashboardContent({
  profile,
  todayActivity,
  scenarioAccuracy,
  quizAccuracy,
  forumPosts,
  lawPerformance,
  recentResponses,
  totalScenarios,
  totalQuizzes,
  activeDays,
}: DashboardContentProps) {
  const { userId: clerkUserId } = useAuth()
  const [availableQuizzes, setAvailableQuizzes] = useState<any[]>([])
  const [userQuizAttempts, setUserQuizAttempts] = useState<string[]>([])
  const [generatingQuiz, setGeneratingQuiz] = useState<string | null>(null)
  const [generatedQuizMap, setGeneratedQuizMap] = useState<Record<string, { id: string; title: string }>>({})
  const [weakAreas, setWeakAreas] = useState<any[]>([])
  const [strongAreas, setStrongAreas] = useState<any[]>([])
  const [generatingQuizzes, setGeneratingQuizzes] = useState<Set<string>>(new Set())
  
  // Tutorial context
  const { isActive: isTutorialActive } = useTutorial()
  
  // Mock data for tutorial demonstration
  const tutorialMockWeakAreas = [
    { law_category: "Law 12", law_section: "Handball", accuracy: 45 },
    { law_category: "Law 11", law_section: "Offside Position", accuracy: 52 },
  ]
  const tutorialMockStrongAreas = [
    { law_category: "Law 14", law_section: "Penalty Kick", accuracy: 92 },
  ]
  const tutorialMockQuizzes = [
    { id: "tutorial-quiz-1", title: "Handball Mastery", difficulty: "medium", quiz_questions: [{ law_category: "Law 12", law_section: "Handball" }] },
    { id: "tutorial-quiz-2", title: "Offside Fundamentals", difficulty: "easy", quiz_questions: [{ law_category: "Law 11", law_section: "Offside Position" }] },
  ]
  
  // Use tutorial mock data when tutorial is active, otherwise use real data
  const displayWeakAreas = isTutorialActive ? tutorialMockWeakAreas : weakAreas
  const displayStrongAreas = isTutorialActive ? tutorialMockStrongAreas : strongAreas
  const displayAvailableQuizzes = isTutorialActive ? tutorialMockQuizzes : availableQuizzes

  useEffect(() => {
    // Give the DOM time to fully render
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("dashboard-ready"))
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Fetch available quizzes and user attempts
  useEffect(() => {
    const fetchQuizzes = async () => {
      const supabase = createClient()
      if (!clerkUserId) return

      // Fetch all active quizzes with their questions to get law categories
      const { data: quizzes, error: quizError } = await supabase
        .from("quizzes")
        .select(`
          id,
          title,
          difficulty,
          quiz_questions(law_category, law_section)
        `)
        .eq("is_active", true)

      

      if (quizzes) {
        setAvailableQuizzes(quizzes)
      }

      // Fetch user's completed quiz attempts
      const { data: attempts, error: attemptsError } = await supabase
        .from("quiz_attempts")
        .select("quiz_id")
        .eq("user_id", clerkUserId)

      

      if (attempts) {
        setUserQuizAttempts(attempts.map((a: { quiz_id: string }) => a.quiz_id))
      }
    }

    fetchQuizzes()
  }, [])

  // Forum and goals features removed - keeping interface props for now to avoid breaking changes

  // Find quizzes related to a weakness area
  const findRelatedQuizzes = (lawCategory: string, lawSection?: string) => {
    const related = displayAvailableQuizzes.filter(quiz => {
      const questions = quiz.quiz_questions || []
      return questions.some((q: any) => {
        const matchesCategory = q.law_category?.toLowerCase().includes(lawCategory.toLowerCase()) ||
          lawCategory.toLowerCase().includes(q.law_category?.toLowerCase() || "")
        const matchesSection = !lawSection || q.law_section?.toLowerCase().includes(lawSection.toLowerCase())
        return matchesCategory && (matchesSection || !q.law_section)
      })
    })
    
    return related
  }

  // Check if user has completed all related quizzes
  const hasCompletedAllRelated = (relatedQuizzes: any[]) => {
    if (relatedQuizzes.length === 0) return true
    return relatedQuizzes.every(quiz => userQuizAttempts.includes(quiz.id))
  }

  // Auto-generate a quiz for a specific topic (runs in background)
  const autoGenerateQuiz = async (lawCategory: string, lawSection?: string) => {
    const topic = lawSection || lawCategory
    
    // Skip if already generating or already generated
    if (generatingQuiz === topic || generatedQuizMap[topic]) return
    
    setGeneratingQuiz(topic)
    setGeneratingQuizzes(prev => new Set(prev.add(topic)))
    
    try {
      const response = await fetch("/api/generate-topic-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          lawCategory,
          lawSection,
        }),
      })

      const data = await response.json()
      if (data.success && data.quiz) {
        setGeneratedQuizMap(prev => ({
          ...prev,
          [topic]: { id: data.quiz.id, title: data.quiz.title }
        }))
        
        // Also refresh the available quizzes list
        const supabase = createClient()
        const { data: quizzes } = await supabase
          .from("quizzes")
          .select(`id, title, difficulty, quiz_questions(law_category, law_section)`)
          .eq("is_active", true)
        
        if (quizzes) setAvailableQuizzes(quizzes)
      }
    } catch {
      // Silently handle
    } finally {
      setGeneratingQuiz(null)
      setGeneratingQuizzes(prev => {
        const newSet = new Set(prev)
        newSet.delete(topic)
        return newSet
      })
    }
  }

  // Calculate and set weak/strong areas from law performance
  // Show data from the very first attempt — weak = below 70%, strong = 70%+
  // As accuracy improves past 70%, areas are removed from weak automatically
  useEffect(() => {
    if (lawPerformance.length === 0) return

    const weak = lawPerformance.filter((l) => l.accuracy < 70).slice(0, 3)
    const strong = lawPerformance
      .filter((l) => l.accuracy >= 70)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 3)

    setWeakAreas(weak)
    setStrongAreas(strong)
  }, [lawPerformance])

  // Auto-generate quizzes for weak areas that don't have related quizzes
  // Skip during tutorial since we use mock data
  useEffect(() => {
    if (isTutorialActive) return // Don't auto-generate during tutorial
    if (weakAreas.length === 0 || availableQuizzes.length === 0) return

    weakAreas.forEach(area => {
      const relatedQuizzes = findRelatedQuizzes(area.law_category, area.law_section)
      const uncompletedQuizzes = relatedQuizzes.filter(q => !userQuizAttempts.includes(q.id))
      const topic = area.law_section || area.law_category
      
      // If no uncompleted quizzes available, auto-generate one
      if (uncompletedQuizzes.length === 0 && !generatedQuizMap[topic]) {
        autoGenerateQuiz(area.law_category, area.law_section)
      }
    })
  }, [isTutorialActive, weakAreas, availableQuizzes, userQuizAttempts, generatedQuizMap])

  return (
    <DashboardWrapper>

      <div className="space-y-6 pb-8">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Welcome back, {profile.display_name || "Referee"}!
          </h1>
          <p className="text-muted-foreground">Ready to sharpen your skills today?</p>
        </div>

        {/* Row 1: 2 CTA Cards — full-bleed animated backgrounds with text overlay */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Scenario CTA */}
          <Link href="/scenarios" data-tutorial="scenarios" className="block">
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg group cursor-pointer overflow-hidden relative">
              <CardContent className="p-0">
                {/* Full-card animated pitch background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/80 to-emerald-900/40">
                  <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full" fill="none" preserveAspectRatio="xMidYMid slice">
                    <style>{`
                      @keyframes pulse-ring{0%,100%{r:20;opacity:0.3}50%{r:28;opacity:0.08}}
                      @keyframes drift1{0%,100%{transform:translate(0,0)}50%{transform:translate(6px,-4px)}}
                      @keyframes drift2{0%,100%{transform:translate(0,0)}50%{transform:translate(-4px,5px)}}
                      @keyframes drift3{0%,100%{transform:translate(0,0)}50%{transform:translate(5px,2px)}}
                      @keyframes ball-roll{0%,100%{transform:translate(0,0)}33%{transform:translate(4px,-2px)}66%{transform:translate(-2px,2px)}}
                      .p1{animation:drift1 4s ease-in-out infinite}
                      .p2{animation:drift2 3.5s ease-in-out infinite}
                      .p3{animation:drift3 5s ease-in-out infinite}
                      .ball{animation:ball-roll 3s ease-in-out infinite}
                      .zone{animation:pulse-ring 2.5s ease-in-out infinite}
                    `}</style>
                    {/* Pitch lines */}
                    <rect x="20" y="15" width="360" height="170" rx="3" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                    <line x1="200" y1="15" x2="200" y2="185" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                    <circle cx="200" cy="100" r="30" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                    <circle cx="200" cy="100" r="2" fill="rgba(255,255,255,0.06)" />
                    <rect x="20" y="50" width="50" height="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <rect x="330" y="50" width="50" height="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    {/* Players */}
                    <circle cx="140" cy="65" r="6" fill="#a855f7" opacity="0.6" className="p1" />
                    <circle cx="150" cy="120" r="6" fill="#a855f7" opacity="0.5" className="p3" />
                    <circle cx="240" cy="90" r="6" fill="#a855f7" opacity="0.4" className="p2" />
                    <circle cx="280" cy="70" r="6" fill="#ec4899" opacity="0.5" className="p1" />
                    <circle cx="170" cy="90" r="6" fill="#ec4899" opacity="0.6" className="p2" />
                    {/* Ball */}
                    <circle cx="160" cy="85" r="4" fill="white" opacity="0.8" className="ball" />
                    {/* Decision zone */}
                    <circle cx="160" cy="85" r="20" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 3" opacity="0.25" className="zone" />
                    {/* Referee */}
                    <circle cx="190" cy="115" r="5" fill="#fbbf24" opacity="0.5" className="p3" />
                  </svg>
                </div>
                {/* Text overlay */}
                <div className="relative z-10 p-5 flex items-end justify-between min-h-[120px]">
                  <div>
                    <h3 className="font-bold text-white text-lg drop-shadow-sm">Scenarios</h3>
                    <p className="text-xs text-white/50 mt-0.5">Practice match decisions</p>
                  </div>
                  <div className="flex items-center gap-1 text-orange-400 shrink-0" data-tutorial="scenario-streak">
                    <Flame className="h-5 w-5" />
                    <span className="font-bold">{profile.scenario_streak || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Quiz CTA */}
          <Link href="/quizzes" data-tutorial="quizzes" className="block">
            <Card className="border-2 hover:border-blue-500/50 transition-all hover:shadow-lg group cursor-pointer overflow-hidden relative">
              <CardContent className="p-0">
                {/* Full-card animated quiz background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950/80 to-indigo-900/50">
                  <style>{`
                    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
                    .q-shimmer{background:linear-gradient(90deg,rgba(255,255,255,0.02) 25%,rgba(255,255,255,0.06) 50%,rgba(255,255,255,0.02) 75%);background-size:200% 100%;animation:shimmer 3s ease-in-out infinite}
                  `}</style>
                  <div className="absolute inset-0 flex items-center justify-center p-6 opacity-60">
                    <div className="w-full max-w-[280px] space-y-2.5">
                      {/* Question skeleton */}
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-400/40" />
                        <div className="h-3 flex-1 rounded-full q-shimmer" />
                      </div>
                      {/* Options */}
                      {[
                        { correct: false, delay: '0s' },
                        { correct: false, delay: '0.2s' },
                        { correct: true, delay: '0.4s' },
                        { correct: false, delay: '0.6s' },
                      ].map((opt, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                            opt.correct
                              ? 'bg-emerald-500/15 border border-emerald-500/25'
                              : 'bg-white/[0.03]'
                          }`}
                        >
                          <div
                            className={`h-5 w-5 rounded-full text-[9px] flex items-center justify-center font-semibold shrink-0 ${
                              opt.correct
                                ? 'bg-emerald-500/30 text-emerald-400'
                                : 'bg-white/[0.06] text-white/20'
                            }`}
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                          <div
                            className={`h-2 rounded-full flex-1 ${opt.correct ? 'bg-emerald-500/25' : 'q-shimmer'}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Text overlay */}
                <div className="relative z-10 p-5 flex items-end min-h-[120px]">
                  <div>
                    <h3 className="font-bold text-white text-lg drop-shadow-sm">Quizzes</h3>
                    <p className="text-xs text-white/50 mt-0.5">Test your knowledge</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Streak Bar — compact inline */}
        <Card className="border">
          <CardContent className="py-3 px-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-lg font-bold">{profile.current_streak || 0}</span>
                <span className="text-xs text-muted-foreground">day streak</span>
              </div>
              <div className="h-4 w-px bg-border" />
              {/* Last 7 days dots */}
              <div className="flex items-center gap-1.5 flex-1">
                {(() => {
                  const activeDaysSet = new Set(activeDays)
                  const todayStr = new Date().toISOString().split("T")[0]
                  return Array.from({ length: 7 }, (_, i) => {
                    const d = new Date()
                    d.setDate(d.getDate() - (6 - i))
                    const dateStr = d.toISOString().split("T")[0]
                    const isActive = activeDaysSet.has(dateStr)
                    const isToday = dateStr === todayStr
                    const dayLabel = d.toLocaleDateString("en-US", { weekday: "narrow" })
                    return (
                      <div key={i} className="flex flex-col items-center gap-0.5 flex-1">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-medium ${
                          isToday ? "bg-purple-500 text-white" : isActive ? "bg-purple-500/30 text-purple-400" : "bg-muted/50 text-muted-foreground/50"
                        }`}>
                          {isActive && !isToday ? <Flame className="h-2.5 w-2.5" /> : dayLabel}
                        </div>
                      </div>
                    )
                  })
                })()}
              </div>
              <div className="h-4 w-px bg-border" />
              <span className="text-xs text-muted-foreground">Best: <span className="font-semibold text-foreground">{profile.longest_streak || 0}</span></span>
            </div>
          </CardContent>
        </Card>

        {/* Row 2: Recommendations & Performance Stats */}
        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Recommendations & Insights */}
          <Card className="border-2" data-tutorial="insights-section">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <CardTitle className="text-lg">Insights & Recommendations</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {displayWeakAreas.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    Areas to improve
                  </p>
                  {displayWeakAreas.map((area, i) => {
                    const relatedQuizzes = findRelatedQuizzes(area.law_category, area.law_section)
                    const uncompletedQuizzes = relatedQuizzes.filter(q => !userQuizAttempts.includes(q.id))
                    const topic = area.law_section || area.law_category
                    const isGenerating = generatingQuizzes.has(topic)
                    const generatedQuiz = generatedQuizMap[topic]
                    
                    // Check if the generated quiz is now in availableQuizzes (after refresh)
                    const generatedQuizInList = generatedQuiz 
                      ? displayAvailableQuizzes.find(q => q.id === generatedQuiz.id)
                      : null
                    
                    // Combine: show uncompleted quizzes from list, or the generated quiz if not yet in list
                    const quizzesToShow = uncompletedQuizzes.length > 0 
                      ? uncompletedQuizzes 
                      : generatedQuizInList 
                        ? [generatedQuizInList]
                        : generatedQuiz 
                          ? [{ id: generatedQuiz.id, title: generatedQuiz.title }]
                          : []
                    
                    return (
                      <div
                        key={i}
                        className="flex flex-col p-3 rounded bg-red-500/10 gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium">{getLawDisplayName(area.law_category, area.law_section)}</span>
                            <span className="text-xs text-muted-foreground">{area.law_category}</span>
                          </div>
                          <Badge variant="outline" className="text-red-500 border-red-500/50 w-fit text-xs">
                            {Math.round(area.accuracy)}%
                          </Badge>
                        </div>
                        
                        {/* Quiz recommendations */}
                        <div className="flex flex-wrap gap-2 mt-1">
                          {quizzesToShow.slice(0, 2).map(quiz => (
                            <Button
                              key={quiz.id}
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs bg-transparent hover:bg-red-500/10"
                              asChild
                            >
                              <Link href={`/quizzes/${quiz.id}`}>
                                <BookOpen className="h-3 w-3 mr-1" />
                                {quiz.title.length > 20 ? quiz.title.substring(0, 20) + "..." : quiz.title}
                              </Link>
                            </Button>
                          ))}

                          {/* Show loading while generating */}
                          {isGenerating && quizzesToShow.length === 0 && (
                            <span className="flex items-center text-xs text-muted-foreground">
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Creating quiz...
                            </span>
                          )}

                          {/* Fallback: link to quizzes page filtered by this law */}
                          {quizzesToShow.length === 0 && !isGenerating && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs bg-transparent hover:bg-red-500/10"
                              asChild
                            >
                              <Link href={`/quizzes?search=${encodeURIComponent(area.law_category)}`}>
                                <BookOpen className="h-3 w-3 mr-1" />
                                Practice {area.law_category}
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {displayStrongAreas.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Your strengths
                  </p>
                  {displayStrongAreas.map((area, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 rounded bg-green-500/10 gap-1 sm:gap-2"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium">{getLawDisplayName(area.law_category, area.law_section)}</span>
                        <span className="text-xs text-muted-foreground">{area.law_category}</span>
                      </div>
                      <Badge variant="outline" className="text-green-500 border-green-500/50 w-fit text-xs">
                        {Math.round(area.accuracy)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              {displayWeakAreas.length === 0 && displayStrongAreas.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Complete a quiz or scenario to get personalised recommendations.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Performance Stats with Graph */}
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                <CardTitle className="text-lg">Performance Stats</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-primary/10">
                  <p className="text-2xl font-bold text-foreground">{scenarioAccuracy}%</p>
                  <p className="text-xs text-muted-foreground">Scenario Accuracy</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-blue-500/10">
                  <p className="text-2xl font-bold text-foreground">{quizAccuracy}%</p>
                  <p className="text-xs text-muted-foreground">Quiz Accuracy</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-foreground">{totalScenarios}</p>
                  <p className="text-xs text-muted-foreground">Total Scenarios</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">{totalQuizzes}</p>
                  <p className="text-xs text-muted-foreground">Total Quizzes</p>
                </div>
              </div>
              <PerformanceChart data={recentResponses} />
            </CardContent>
          </Card>
        </div>

        {/* Row 3: Law-by-law breakdown */}
        <Card className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-pink-500" />
              <CardTitle className="text-lg">Law-by-Law Breakdown</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <LawBreakdownChart
              data={lawPerformance}
              availableQuizzes={displayAvailableQuizzes}
              userQuizAttempts={userQuizAttempts}
            />
          </CardContent>
        </Card>

      </div>
    </DashboardWrapper>
  )
}
