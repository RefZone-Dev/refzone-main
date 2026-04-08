"use client"

import { useMemo, useState } from "react"
import { BookOpen } from "lucide-react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ComposedChart,
} from "recharts"

interface PerformanceChartProps {
  data: Array<{
    is_correct: boolean
    created_at: string
  }>
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return []
    }

    // Get last 7 days
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      days.push(d.toLocaleDateString("en-US", { weekday: "short" }))
    }

    // Group by day
    const byDay: Record<string, { correct: number; total: number }> = {}
    days.forEach((day) => {
      byDay[day] = { correct: 0, total: 0 }
    })

    for (const response of data) {
      const day = new Date(response.created_at).toLocaleDateString("en-US", {
        weekday: "short",
      })
      if (byDay[day]) {
        byDay[day].total += 1
        if (response.is_correct) {
          byDay[day].correct += 1
        }
      }
    }

    return days.map((day) => ({
      day,
      questions: byDay[day].total,
      accuracy: byDay[day].total > 0 ? Math.round((byDay[day].correct / byDay[day].total) * 100) : 0,
    }))
  }, [data])

  const totalQuestions = chartData.reduce((sum, d) => sum + d.questions, 0)

  if (chartData.length === 0 || totalQuestions === 0) {
    // Show chart frame with zero data so it doesn't look broken
    const emptyDays = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      emptyDays.push({ day: d.toLocaleDateString("en-US", { weekday: "short" }), questions: 0, accuracy: 0 })
    }
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground">Questions answered — last 7 days</p>
          <p className="text-xs font-semibold text-muted-foreground">0 total</p>
        </div>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={emptyDays}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" domain={[0, 5]} />
              <Bar dataKey="questions" fill="rgba(168,85,247,0.15)" radius={[4, 4, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">Activity will appear here as you train</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground">Questions answered — last 7 days</p>
        <p className="text-xs font-semibold text-primary">{totalQuestions} total</p>
      </div>
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} className="text-muted-foreground" />
            <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <Bar dataKey="questions" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#ec4899"
              strokeWidth={2}
              dot={{ fill: "#ec4899", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-purple-500" /> Questions
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-pink-500" /> Accuracy trend
        </span>
      </div>
    </div>
  )
}

const ALL_LAWS = [
  { num: 1, name: "The Field of Play" },
  { num: 2, name: "The Ball" },
  { num: 3, name: "The Players" },
  { num: 4, name: "The Players' Equipment" },
  { num: 5, name: "The Referee" },
  { num: 6, name: "The Other Match Officials" },
  { num: 7, name: "The Duration of the Match" },
  { num: 8, name: "The Start and Restart of Play" },
  { num: 9, name: "The Ball In and Out of Play" },
  { num: 10, name: "Determining the Outcome" },
  { num: 11, name: "Offside" },
  { num: 12, name: "Fouls and Misconduct" },
  { num: 13, name: "Free Kicks" },
  { num: 14, name: "The Penalty Kick" },
  { num: 15, name: "The Throw-In" },
  { num: 16, name: "The Goal Kick" },
  { num: 17, name: "The Corner Kick" },
]

interface LawBreakdownChartProps {
  data: Array<{
    law_category: string
    law_section?: string
    accuracy: number
    total_attempts: number
  }>
  availableQuizzes?: any[]
  userQuizAttempts?: string[]
}

export function LawBreakdownChart({ data, availableQuizzes = [], userQuizAttempts = [] }: LawBreakdownChartProps) {
  const [sortBy, setSortBy] = useState<"number" | "accuracy">("accuracy")

  // Build a map from data
  const dataMap = useMemo(() => {
    const map: Record<string, { accuracy: number; total: number }> = {}
    if (!data) return map
    for (const item of data) {
      // Normalize "Law 12" -> 12
      const match = item.law_category.match(/\d+/)
      const key = match ? match[0] : item.law_category
      if (!map[key]) {
        map[key] = { accuracy: 0, total: 0 }
      }
      // Weighted average if multiple sections per law
      const prevTotal = map[key].total
      const newTotal = prevTotal + item.total_attempts
      map[key].accuracy = newTotal > 0
        ? Math.round(((map[key].accuracy * prevTotal) + (item.accuracy * item.total_attempts)) / newTotal)
        : item.accuracy
      map[key].total = newTotal
    }
    return map
  }, [data])

  const hasAnyData = Object.keys(dataMap).length > 0

  const chartData = useMemo(() => {
    const allRows = ALL_LAWS.map((law) => {
      const d = dataMap[String(law.num)]
      return {
        num: law.num,
        label: `Law ${law.num}`,
        name: law.name,
        accuracy: d ? d.accuracy : null as number | null,
        total: d ? d.total : 0,
      }
    })

    if (sortBy === "number") {
      return allRows
    }
    // By accuracy: laws with data first (sorted desc), then N/A laws by number
    const withData = allRows.filter((r) => r.accuracy !== null).sort((a, b) => b.accuracy! - a.accuracy!)
    const noData = allRows.filter((r) => r.accuracy === null)
    return [...withData, ...noData]
  }, [dataMap, sortBy])


  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground">Accuracy by law</p>
        {chartData.length > 1 && (
          <div className="flex gap-1">
            <button
              onClick={() => setSortBy("number")}
              className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
                sortBy === "number" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              In order
            </button>
            <button
              onClick={() => setSortBy("accuracy")}
              className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
                sortBy === "accuracy" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              By accuracy
            </button>
          </div>
        )}
      </div>
      <div className="space-y-2">
        {chartData.map((item) => {
          return (
            <div key={item.num} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-14 shrink-0">{item.label}</span>
              <div className="flex-1 h-3.5 rounded-full bg-muted overflow-hidden">
                {item.accuracy !== null ? (
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                    style={{ width: `${Math.max(item.accuracy, 2)}%` }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="h-px w-4 bg-muted-foreground/20" />
                  </div>
                )}
              </div>
              <span className={`text-xs w-9 text-right shrink-0 ${
                item.accuracy === null ? "text-muted-foreground/40" : "font-semibold"
              }`}>
                {item.accuracy !== null ? `${item.accuracy}%` : "N/A"}
              </span>
              <Link
                href={`/quizzes?search=${encodeURIComponent(`Law ${item.num}`)}`}
                className="shrink-0 flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                <BookOpen className="h-3 w-3" />
                Practice
              </Link>
            </div>
          )
        })}
      </div>
      {!hasAnyData && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Complete a quiz or scenario to see your accuracy
        </p>
      )}
    </div>
  )
}
