"use client"

import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

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

    // Group by date and calculate daily accuracy
    const byDate: Record<string, { correct: number; total: number }> = {}

    for (const response of data) {
      const date = new Date(response.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })

      if (!byDate[date]) {
        byDate[date] = { correct: 0, total: 0 }
      }
      byDate[date].total += 1
      if (response.is_correct) {
        byDate[date].correct += 1
      }
    }

    return Object.entries(byDate).map(([date, stats]) => ({
      date,
      accuracy: Math.round((stats.correct / stats.total) * 100),
      count: stats.total,
    }))
  }, [data])

  if (chartData.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">
        Complete scenarios to see your progress
      </div>
    )
  }

  return (
    <div className="h-32 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} className="text-muted-foreground" />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} className="text-muted-foreground" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
