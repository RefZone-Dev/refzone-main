"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Target, TrendingUp, Flame, Award, Flag as Flask, BookOpen, Star, TrendingDown, Loader2 } from "lucide-react"
import { DashboardWrapper } from "./dashboard-wrapper"
import { PerformanceChart } from "./performance-chart"
import { createClient } from "@/lib/supabase/client"
import { useTutorial } from "@/components/tutorial/tutorial-context"

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
}: DashboardContentProps) {
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
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return
      const user = session.user

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
        .eq("user_id", user.id)

      

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
    } catch (error) {
      console.error("[v0] Error auto-generating quiz:", error)
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
  useEffect(() => {
    if (lawPerformance.length === 0) return
    
    const weak = lawPerformance.filter((l) => l.accuracy < 60).slice(0, 3)
    const strong = lawPerformance.filter((l) => l.accuracy >= 80).slice(0, 3)

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
    <DashboardWrapper
      hasSetGoals={false}
      currentScenarioGoal={0}
      currentQuizGoal={0}
    >

      <div className="space-y-6 pb-8">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Welcome back, {profile.display_name || "Referee"}!
          </h1>
          <p className="text-muted-foreground">Ready to sharpen your skills today?</p>
        </div>

        {/* Row 1: 2 CTA Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Scenario CTA with Streak */}
          <Link href="/scenarios" data-tutorial="scenarios" className="block">
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg group cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 text-orange-500" data-tutorial="scenario-streak">
                    <Flame className="h-5 w-5" />
                    <span className="font-bold">{profile.scenario_streak || 0}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-1">Scenarios</h3>
                <p className="text-sm text-muted-foreground">Practice decisions</p>
              </CardContent>
            </Card>
          </Link>

          {/* Quiz CTA */}
          <Link href="/quizzes" data-tutorial="quizzes" className="block">
            <Card className="border-2 hover:border-blue-500/50 transition-all hover:shadow-lg group cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-1">Quizzes</h3>
                <p className="text-sm text-muted-foreground">Test knowledge</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Row 2: Recommendations & Performance Stats */}
        <div className="grid md:grid-cols-2 gap-6">
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
                            <span className="text-sm font-medium">{area.law_section || area.law_category}</span>
                            {area.law_section && <span className="text-xs text-muted-foreground">{area.law_category}</span>}
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
                        <span className="text-sm font-medium">{area.law_section || area.law_category}</span>
                        {area.law_section && <span className="text-xs text-muted-foreground">{area.law_category}</span>}
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
                  Complete more scenarios to get personalized recommendations.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Performance Stats with Graph */}
          <Card className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-yellow-500" />
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


      </div>
    </DashboardWrapper>
  )
}
