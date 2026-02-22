"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2, RotateCcw, Scale, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function DecisionLabClient() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/decision-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          isInitial: messages.length === 0,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()
      setMessages([...newMessages, { role: "assistant", content: data.response }])
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setMessages([])
    setInput("")
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Decision Lab</h1>
          <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            BETA
          </Badge>
        </div>
        <p className="text-muted-foreground mt-1">
          Describe a match scenario and get expert analysis based on the Laws of the Game
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Beta Feature - AI Disclaimer</p>
          <p className="mt-1">
            This feature uses AI to analyze scenarios. AI responses may be inaccurate or incomplete.
            Always refer to the official IFAB Laws of the Game for definitive rulings. Do not use
            AI-generated analysis as the sole basis for match decisions.
          </p>
        </div>
      </div>

      <Card className="flex flex-col" style={{ height: "calc(100vh - 280px)" }}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Scenario Analyzer</CardTitle>
            </div>
            {messages.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                New Scenario
              </Button>
            )}
          </div>
          {messages.length === 0 && (
            <CardDescription>
              Describe what happened in the match - include details like where on the pitch, what players did, and what contact was made.
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden pb-4">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4 max-w-md">
                <Scale className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                <div>
                  <p className="font-medium text-foreground">Describe your scenario</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    For example: &quot;A defender slides in from behind and makes contact with the attacker&apos;s ankle before touching the ball, just outside the penalty area.&quot;
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <ScrollArea className="flex-1" ref={scrollRef}>
              <div className="space-y-4 pr-4">
                {messages.map((message, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 text-sm ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === "assistant" && (
                      <p className="text-xs text-muted-foreground mt-1 ml-1 italic">
                        AI-generated analysis - may contain errors. Verify with official LOTG.
                      </p>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe what happened..."
              className="resize-none min-h-[44px] max-h-[120px]"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="shrink-0">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
