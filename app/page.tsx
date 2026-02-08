"use client"

import React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Target,
  CheckCircle,
  ArrowRight,
  Zap,
  Users,
  Trophy,
  TrendingUp
} from "lucide-react"

const features = [
  { id: "decision-lab", label: "Decision Lab", icon: Brain, beta: true },
  { id: "quizzes", label: "Quizzes", icon: BookOpen },
  { id: "scenarios", label: "Scenarios", icon: Target },
  { id: "insights", label: "Insights", icon: TrendingUp },
  { id: "reports", label: "Match Reports", icon: FileText, beta: true },
  { id: "forum", label: "Community", icon: MessageSquare },
]

const featureDetails: Record<string, {
  title: string
  description: string
  bullets: string[]
  screenshot: string
}> = {
  "decision-lab": {
    title: "AI-Powered Decision Lab",
    description: "Get instant, expert analysis of any match scenario. Our AI referee assistant knows the Laws of the Game inside and out.",
    bullets: [
      "Ask any refereeing question and get accurate LOTG answers",
      "Receive specific Law references with your answers",
      "Learn through interactive scenario analysis",
      "Available 24/7 to help you improve"
    ],
    screenshot: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1000016359-SDZQmYPLWsbBsydP7hDV9fRNE1XSdy.jpg"
  },
  "quizzes": {
    title: "Test Your Knowledge",
    description: "Challenge yourself with quizzes covering all 17 Laws of the Game. Track your progress and identify areas for improvement.",
    bullets: [
      "Hundreds of questions across all law categories",
      "Difficulty levels from beginner to expert",
      "Personalized recommendations based on your weaknesses",
      "Track your accuracy and improvement over time"
    ],
    screenshot: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1000016361-UcVGTne1zSVURjOLiuzGz67Bfa7rpI.jpg"
  },
  "scenarios": {
    title: "Real Match Scenarios",
    description: "Practice your decision-making with realistic match situations. Experience the pressure of making split-second calls.",
    bullets: [
      "Video-based and text scenarios",
      "Covers common and edge-case situations",
      "Detailed explanations for every decision",
      "Learn from mistakes in a safe environment"
    ],
    screenshot: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1000016358-FuIwVOxowajLIuLDU122mBGoHVvGnB.jpg"
  },
  "insights": {
    title: "Insights & Recommendations",
    description: "Get personalized insights into your performance and targeted recommendations to improve your weak areas.",
    bullets: [
      "Track your accuracy across all 17 Laws",
      "Identify your strengths and weaknesses",
      "Algorithm-generated quizzes targeting your weak spots",
      "Personalized learning path recommendations"
    ],
    screenshot: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sgg6JgPpUofMm9S3LWPo5k8vIwkViw.png"
  },
  "reports": {
    title: "Professional Match Reports",
    description: "Generate professional-grade match reports with AI assistance. Perfect for documenting incidents and improving your paperwork.",
    bullets: [
      "AI-assisted report generation",
      "Templates for send-offs, incidents, and more",
      "Save and export your reports",
      "Learn proper documentation practices"
    ],
    screenshot: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Green%20and%20Brown%20Minimalist%20Studio%20Logo%20Design%20Template_20260206_160950_0000-jWDIcaGaYXjYvGkOrHZ0EOMYl8W6ZO.png"
  },
  "forum": {
    title: "Join the Community",
    description: "Connect with referees worldwide. Share experiences, ask questions, and learn from others in the refereeing community.",
    bullets: [
      "Discuss difficult decisions with peers",
      "Share and learn from real match experiences",
      "Get advice from experienced officials",
      "Build your professional network"
    ],
    screenshot: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Green%20and%20Brown%20Minimalist%20Studio%20Logo%20Design%20Template_20260206_161416_0000-VHM24HDmY3nyjNTTl2QBq3FXqJPBWn.png"
  },
}

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState("decision-lab")
  const [pillStyle, setPillStyle] = useState({ left: 6, width: 0 })
  const [pillInitialized, setPillInitialized] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  
  // Initialize pill position on mount
  React.useEffect(() => {
    if (navRef.current && !pillInitialized) {
      const firstButton = navRef.current.querySelector('button')
      if (firstButton) {
        const navRect = navRef.current.getBoundingClientRect()
        const buttonRect = firstButton.getBoundingClientRect()
        setPillStyle({
          left: buttonRect.left - navRect.left,
          width: buttonRect.width,
        })
        setPillInitialized(true)
      }
    }
  }, [pillInitialized])

  const handleFeatureClick = (featureId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveFeature(featureId)
    const button = e.currentTarget
    if (navRef.current) {
      const navRect = navRef.current.getBoundingClientRect()
      const buttonRect = button.getBoundingClientRect()
      setPillStyle({
        left: buttonRect.left - navRect.left,
        width: buttonRect.width,
      })
    }
  }

  const currentFeature = featureDetails[activeFeature]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold">
              <span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">R</span>
              <span className="text-gray-900 dark:text-white">efZone</span>
            </span>
            <span className="text-[10px] align-super text-gray-500 ml-0.5">&#174;</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/forum">
              <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Forum
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Log in
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] hover:from-[#7a0f94] hover:to-[#e54da3] text-white rounded-full px-6">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-pink-50/50 to-white dark:from-purple-950/20 dark:to-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-950/50 dark:to-purple-950/50 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            RefZone Algorithms - Advanced Training
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight text-balance">
            Train like a<br /><span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">professional referee</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto text-pretty">
            Master the Laws of the Game with our advanced RefZone Algorithms that power intelligent scenarios, adaptive quizzes, and expert analysis. Join hundreds of referees improving their skills every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] hover:from-[#7a0f94] hover:to-[#e54da3] text-white rounded-full px-8 h-14 text-lg">
                Get started - it's free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-14 text-lg bg-transparent border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50"
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore features
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-purple-100 dark:border-purple-900/30 bg-gradient-to-r from-pink-50/50 via-purple-50/50 to-pink-50/50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-400">Quiz Questions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent mb-2">100+</div>
              <div className="text-gray-600 dark:text-gray-400">Match Scenarios</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent mb-2">17</div>
              <div className="text-gray-600 dark:text-gray-400">Laws Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-400">Smart Analysis</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Pill Navigation */}
      <section className="py-24 px-6" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Everything you need to improve</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Comprehensive tools designed for referees at every level</p>
          </div>

          {/* Pill Navigation */}
          <div className="flex justify-center mb-12 overflow-x-auto pb-2">
            <div 
              ref={navRef}
              className="relative inline-flex bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-950/50 dark:to-purple-950/50 rounded-full p-1.5"
            >
              {/* Animated Pill Background */}
              <div 
                className="absolute top-1.5 bottom-1.5 bg-white dark:bg-gray-800 rounded-full shadow-sm transition-all duration-300 ease-out"
                style={{ 
                  left: pillStyle.left || 6, 
                  width: pillStyle.width || 120,
                }}
              />
              
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={(e) => handleFeatureClick(feature.id, e)}
                  className={`relative z-10 flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                    activeFeature === feature.id
                      ? "text-purple-700 dark:text-purple-300"
                      : "text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                  }`}
                >
                  <feature.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{feature.label}</span>
                  {feature.beta && (
                    <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0 h-4">BETA</Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Feature Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{currentFeature.title}</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">{currentFeature.description}</p>
              <ul className="space-y-4">
                {currentFeature.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{bullet}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/auth/sign-up">
                  <Button className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] hover:from-[#7a0f94] hover:to-[#e54da3] text-white rounded-full px-6">
                    Try it free
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-2xl p-4 shadow-2xl">
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center">
                  {currentFeature.screenshot ? (
                    <Image
                      src={currentFeature.screenshot || "/placeholder.svg"}
                      alt={currentFeature.title}
                      width={400}
                      height={300}
                      className="w-full h-auto object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 p-8 aspect-[4/3] flex flex-col items-center justify-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                        {features.find(f => f.id === activeFeature)?.icon && (
                          <div className="w-8 h-8 text-purple-400">
                            {(() => {
                              const Icon = features.find(f => f.id === activeFeature)?.icon
                              return Icon ? <Icon className="w-8 h-8" /> : null
                            })()}
                          </div>
                        )}
                      </div>
                      <p className="text-sm">Screenshot of {currentFeature.title}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-purple-50/50 to-white dark:from-purple-950/20 dark:to-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Why referees choose <span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">R</span>efZone</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Built by referees, for referees</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg dark:bg-gray-800 hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/50 dark:to-purple-900/50 flex items-center justify-center">
                  <Brain className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">AI-Powered Learning</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get instant answers to any refereeing question with our AI assistant trained on the Laws of the Game.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg dark:bg-gray-800 hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/50 dark:to-purple-900/50 flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-pink-600 dark:text-pink-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Track Your Progress</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Monitor your improvement with detailed analytics, streaks, and performance insights.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg dark:bg-gray-800 hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/50 dark:to-purple-900/50 flex items-center justify-center">
                  <Users className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Active Community</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Connect with fellow referees, share experiences, and learn from the community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-t from-pink-50/50 to-white dark:from-purple-950/20 dark:to-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 text-balance">
            Ready to become a <span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">better referee</span>?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">
            Join hundreds of referees who are already improving their skills with RefZone.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] hover:from-[#7a0f94] hover:to-[#e54da3] text-white rounded-full px-10 h-14 text-lg shadow-lg hover:shadow-xl transition-shadow">
              Start training for free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-100 dark:border-purple-900/30 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center">
              <span className="text-xl font-bold">
                <span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">R</span>
                <span className="text-gray-900 dark:text-white">efZone</span>
              </span>
              <span className="text-[10px] align-super text-gray-500 ml-0.5">&#174;</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
  <Link href="/terms" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Terms</Link>
  <Link href="/privacy" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Privacy</Link>
  <a href="mailto:admin@refzone.com.au" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Contact</a>
  <Link href="/auth/login" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Log in</Link>
  </div>
            <div className="text-sm text-gray-500 dark:text-gray-500">
              &copy; 2026 RefZone. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
