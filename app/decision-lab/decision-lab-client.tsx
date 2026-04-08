"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2, RotateCcw, Scale, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Message {
  role: "user" | "assistant"
  content: string
}

// Renders AI responses with formatting: bold, italics, law references, and highlights
function FormattedResponse({ content }: { content: string }) {
  // Split into paragraphs
  const paragraphs = content.split(/\n\n+/)

  return (
    <div className="space-y-3">
      {paragraphs.map((para, i) => {
        const trimmed = para.trim()
        if (!trimmed) return null

        // Check if it's a law reference line (e.g. "Law 12.2: ..." or "**Law 14**")
        const isLawRef = /^(Law \d+|IFAB|According to Law)/i.test(trimmed.replace(/\*\*/g, ""))

        // Check if it looks like a summary/verdict line
        const isSummary = /^(Summary|Verdict|Decision|Correct (decision|call)|In summary|Quick summary|TL;DR)/i.test(trimmed.replace(/\*\*/g, ""))

        // Format inline markdown
        const formatInline = (text: string) => {
          const parts: React.ReactNode[] = []
          let remaining = text
          let key = 0

          while (remaining.length > 0) {
            // Bold: **text**
            const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
            // Italic: *text* or _text_
            const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/)
            // Law reference: Law XX
            const lawMatch = remaining.match(/(Law \d+(\.\d+)?)/i)

            // Find earliest match
            const matches = [
              boldMatch ? { type: "bold", match: boldMatch } : null,
              italicMatch ? { type: "italic", match: italicMatch } : null,
              lawMatch && !boldMatch ? { type: "law", match: lawMatch } : null,
            ].filter(Boolean).sort((a, b) => (a!.match.index || 0) - (b!.match.index || 0))

            if (matches.length === 0 || matches[0]!.match.index === undefined) {
              parts.push(<span key={key++}>{remaining}</span>)
              break
            }

            const first = matches[0]!
            const idx = first.match.index!

            // Text before match
            if (idx > 0) parts.push(<span key={key++}>{remaining.slice(0, idx)}</span>)

            if (first.type === "bold") {
              parts.push(<strong key={key++} className="font-semibold text-foreground">{first.match[1]}</strong>)
            } else if (first.type === "italic") {
              parts.push(<em key={key++} className="italic">{first.match[1]}</em>)
            } else if (first.type === "law") {
              parts.push(<span key={key++} className="text-purple-400 font-medium">{first.match[0]}</span>)
            }

            remaining = remaining.slice(idx + first.match[0].length)
          }

          return parts
        }

        // Law reference block
        if (isLawRef) {
          return (
            <div key={i} className="rounded-md bg-purple-500/10 border border-purple-500/20 px-3 py-2 text-xs text-purple-400">
              {formatInline(trimmed)}
            </div>
          )
        }

        // Summary block
        if (isSummary) {
          return (
            <div key={i} className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-sm">
              {formatInline(trimmed)}
            </div>
          )
        }

        // Check for bullet points
        if (trimmed.includes("\n- ") || trimmed.startsWith("- ")) {
          const lines = trimmed.split("\n")
          return (
            <div key={i}>
              {lines.map((line, j) => {
                if (line.startsWith("- ")) {
                  return <p key={j} className="pl-3 border-l-2 border-purple-500/20 ml-1 my-1">{formatInline(line.slice(2))}</p>
                }
                return <p key={j} className="whitespace-pre-wrap">{formatInline(line)}</p>
              })}
            </div>
          )
        }

        return <p key={i} className="whitespace-pre-wrap">{formatInline(trimmed)}</p>
      })}
    </div>
  )
}

export default function DecisionLabClient() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Auto-submit a question from URL query param (e.g. ?q=Tell me about...)
  const submitMessage = useCallback(async (text: string) => {
    const userMessage: Message = { role: "user", content: text }
    const newMessages = [userMessage]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const response = await fetch("/api/decision-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, isInitial: true }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()
      if (data.error) {
        setMessages([...newMessages, { role: "assistant", content: `Error: ${data.error}` }])
      } else {
        setMessages([...newMessages, { role: "assistant", content: data.response }])
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const q = searchParams.get("q")
    if (q && !hasAutoSubmitted && messages.length === 0) {
      setHasAutoSubmitted(true)
      submitMessage(q)
    }
  }, [searchParams, hasAutoSubmitted, messages.length, submitMessage])

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
      
      if (data.error) {
        setMessages([
          ...newMessages,
          { role: "assistant", content: `Error: ${data.error}` },
        ])
      } else {
        setMessages([...newMessages, { role: "assistant", content: data.response }])
      }
    } catch (error) {
      console.error("[v0] Decision Lab error:", error)
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
          <p className="font-medium text-foreground">Beta Feature - Disclaimer</p>
          <p className="mt-1">
            Decision Lab uses a specialised AI trained on the Laws of the Game to analyse scenarios. Responses may be inaccurate or incomplete.
            Always refer to the official IFAB Laws of the Game for definitive rulings. Do not use
            generated analysis as the sole basis for match decisions.
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
            <div className="flex-1 overflow-y-auto pr-2" ref={scrollRef}>
              <div className="space-y-4">
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
                      {message.role === "assistant" ? (
                        <FormattedResponse content={message.content} />
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                    {message.role === "assistant" && (
                      <p className="text-xs text-muted-foreground mt-1 ml-1 italic">
                        Generated analysis - may contain errors. Verify with official LOTG.
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
            </div>
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
