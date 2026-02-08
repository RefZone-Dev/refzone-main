"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { FlaskConical, Send, Trash2, Save, Loader2, User, Bot } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CustomModal } from "@/components/custom-modal"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface Analysis {
  id: string
  scenario_description: string
  conversation: Message[]
  created_at: string
}

export default function DecisionLabPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [scenario, setScenario] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [savedAnalyses, setSavedAnalyses] = useState<Analysis[]>([])
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const [modal, setModal] = useState({
    isOpen: false,
    type: "info" as "success" | "error" | "warning" | "info" | "confirm",
    title: "",
    message: "",
    onConfirm: () => {},
  })

  const showModal = (
    type: "success" | "error" | "warning" | "info" | "confirm",
    title: string,
    message: string,
    onConfirm?: () => void,
  ) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
      onConfirm: onConfirm || (() => {}),
    })
  }

  useEffect(() => {
    const fetchUserAndAnalyses = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUserId(user.id)

      const { data } = await supabase
        .from("decision_lab_analyses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)

      if (data) {
        setSavedAnalyses(data)
      }
    }

    fetchUserAndAnalyses()
  }, [router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleAnalyze = async () => {
    if (!scenario.trim() && messages.length === 0) return

    const userMessage = scenario.trim()
    setScenario("")

    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }]
    setMessages(newMessages)
    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/decision-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          isInitial: messages.length === 0,
        }),
      })

      const data = await response.json()
      setMessages([...newMessages, { role: "assistant", content: data.response }])
    } catch (error) {
      console.error("[v0] Error analyzing scenario:", error)
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "I apologize, but I encountered an error analyzing your scenario. Please try again.",
        },
      ])
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSave = async () => {
    if (!userId || messages.length === 0) return

    try {
      const supabase = createClient()
      const firstUserMessage = messages.find((m) => m.role === "user")?.content || "Scenario Analysis"

      if (currentAnalysisId) {
        // Update existing analysis
        await supabase
          .from("decision_lab_analyses")
          .update({
            conversation: messages,
          })
          .eq("id", currentAnalysisId)
      } else {
        // Create new analysis
        const { data } = await supabase
          .from("decision_lab_analyses")
          .insert({
            user_id: userId,
            scenario_description: firstUserMessage,
            conversation: messages,
          })
          .select()
          .single()

        if (data) {
          setCurrentAnalysisId(data.id)
          setSavedAnalyses([data, ...savedAnalyses])
        }
      }

      showModal("success", "Analysis Saved", "Your analysis has been saved successfully!")
    } catch (error) {
      console.error("[v0] Error saving analysis:", error)
      showModal("error", "Save Failed", "Failed to save analysis. Please try again.")
    }
  }

  const handleLoadAnalysis = (analysis: Analysis) => {
    setMessages(analysis.conversation)
    setCurrentAnalysisId(analysis.id)
  }

  const handleClear = () => {
    showModal(
      "confirm",
      "Clear Conversation",
      "Are you sure you want to clear the current conversation? This action cannot be undone.",
      () => {
        setMessages([])
        setScenario("")
        setCurrentAnalysisId(null)
      },
    )
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <CustomModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={modal.onConfirm}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />

      <div>
        <div className="flex items-center gap-3 mb-2">
          <FlaskConical className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">DecisionLab</h1>
          <Badge variant="secondary" className="text-xs">BETA</Badge>
        </div>
        <p className="text-muted-foreground">AI-powered scenario interpreter and LOTG expert</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Chat Area */}
        <div className="lg:col-span-2 space-y-4">
          <Alert>
            <AlertDescription>
              Describe a real-life match scenario you encountered. The AI will ask clarifying questions and provide
              expert analysis based on the Laws of the Game.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive" className="bg-yellow-50 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100">
            <AlertDescription className="text-sm">
              <strong>AI Disclaimer:</strong> This AI assistant may provide incorrect interpretations or miss important context. Always verify decisions against the official Laws of the Game and consult with experienced referees or assessors when needed.
            </AlertDescription>
          </Alert>

          {/* Messages */}
          {messages.length > 0 && (
            <Card className="min-h-[400px] max-h-[600px] overflow-y-auto">
              <CardContent className="pt-6 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground border"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === "user" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <User className="h-4 w-4 text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {isAnalyzing && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="max-w-[80%] rounded-lg p-4 bg-muted border">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>
            </Card>
          )}

          {/* Input Area */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Textarea
                placeholder={
                  messages.length === 0
                    ? "Describe your match scenario here... For example: 'In the 75th minute, an attacker went down in the penalty area after contact with a defender...'"
                    : "Continue the conversation or ask follow-up questions..."
                }
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                rows={4}
                className="resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleAnalyze()
                  }
                }}
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {messages.length > 0 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSave}
                        className="cursor-pointer bg-transparent"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClear}
                        className="cursor-pointer bg-transparent"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                    </>
                  )}
                </div>
                <Button onClick={handleAnalyze} disabled={!scenario.trim() || isAnalyzing} className="cursor-pointer">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {messages.length === 0 ? "Analyze" : "Send"}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Saved Analyses Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Saved Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              {savedAnalyses.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No saved analyses yet</p>
              ) : (
                <div className="space-y-2">
                  {savedAnalyses.map((analysis) => (
                    <button
                      key={analysis.id}
                      onClick={() => handleLoadAnalysis(analysis)}
                      className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <p className="text-sm font-medium line-clamp-2 mb-1">{analysis.scenario_description}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {new Date(analysis.created_at).toLocaleDateString()}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {analysis.conversation.length} msgs
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
