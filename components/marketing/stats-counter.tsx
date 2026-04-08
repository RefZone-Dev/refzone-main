'use client'

import { useEffect, useRef, useState } from 'react'

/* ================================================================
   STATS COUNTER — Animated counting numbers on scroll
   ================================================================ */

function parseValue(value: string): { numeric: number; prefix: string; suffix: string } {
  const match = value.match(/^([^\d]*)(\d+)(.*)$/)
  if (!match) return { numeric: 0, prefix: '', suffix: value }
  return { numeric: parseInt(match[2], 10), prefix: match[1], suffix: match[3] }
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function StatsCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [display, setDisplay] = useState('0')
  const hasAnimated = useRef(false)

  const { numeric, prefix, suffix } = parseValue(value)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          observer.unobserve(el)

          const duration = 1500
          const start = performance.now()

          function tick(now: number) {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = easeOutCubic(progress)
            const current = Math.round(numeric * eased)

            if (progress < 1) {
              setDisplay(`${prefix}${current}`)
              requestAnimationFrame(tick)
            } else {
              setDisplay(value)
            }
          }

          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [numeric, prefix, suffix, value])

  return (
    <div ref={ref} className="text-center">
      <p className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
        {display}
      </p>
      <p className="mt-1 text-sm text-white/45">{label}</p>
    </div>
  )
}
