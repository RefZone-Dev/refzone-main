'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Check, Flame, BarChart3, Target, BookOpen } from 'lucide-react'

const PHASE_DURATION = 4000
const TOTAL_PHASES = 3
const CROSS_FADE_MS = 500

const options = [
  { label: 'A', text: 'Direct free kick + yellow card' },
  { label: 'B', text: 'Direct free kick + red card' },
  { label: 'C', text: 'Indirect free kick' },
]

export function HeroDemo() {
  const [phase, setPhase] = useState(0)
  const [visible, setVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [phaseTime, setPhaseTime] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    setPhaseTime(0)
    const tick = 50
    let elapsed = 0
    timerRef.current = setInterval(() => {
      elapsed += tick
      setPhaseTime(elapsed)
      if (elapsed >= PHASE_DURATION) {
        elapsed = 0
        setPhaseTime(0)
        setPhase((p) => (p + 1) % TOTAL_PHASES)
      }
    }, tick)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [visible, phase])

  const animateValue = useCallback(
    (target: number, durationMs: number, delayMs: number) => {
      const t = Math.max(0, phaseTime - delayMs)
      if (t <= 0) return 0
      const progress = Math.min(t / durationMs, 1)
      return Math.round(target * (1 - Math.pow(1 - progress, 3)))
    },
    [phaseTime],
  )

  const phaseStyle = (index: number): React.CSSProperties => ({
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    padding: '2rem 2.5rem',
    opacity: phase === index ? 1 : 0,
    transform: phase === index ? 'translateY(0)' : 'translateY(12px)',
    transition: `opacity ${CROSS_FADE_MS}ms ease, transform ${CROSS_FADE_MS}ms ease`,
    pointerEvents: phase === index ? 'auto' : 'none',
  })

  /* Phase 0 */
  const showOptions = phaseTime > 400
  const answerRevealed = phaseTime > 1900
  const correctBadge = phaseTime > 2300

  /* Phase 1 */
  const progressPct = phase === 1 ? animateValue(73, 1800, 300) : 0
  const accuracyRing = phase === 1 ? animateValue(73, 2000, 600) : 0
  const correctCount = phase === 1 ? animateValue(11, 1400, 400) : 0
  const ringR = 44
  const ringC = 2 * Math.PI * ringR
  const ringOffset = ringC - (ringC * accuracyRing) / 100

  /* Phase 2 */
  const bar1 = phase === 2 ? animateValue(85, 1200, 200) : 0
  const bar2 = phase === 2 ? animateValue(72, 1200, 400) : 0
  const bar3 = phase === 2 ? animateValue(91, 1200, 600) : 0
  const bar4 = phase === 2 ? animateValue(68, 1200, 500) : 0
  const bar5 = phase === 2 ? animateValue(78, 1200, 350) : 0
  const streak = phase === 2 ? animateValue(12, 1000, 800) : 0
  const overallAcc = phase === 2 ? animateValue(87, 1400, 500) : 0

  return (
    <div ref={containerRef}>
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
        style={{ minHeight: 420 }}>

        {/* === Phase 0: Scenario Decision === */}
        <div style={phaseStyle(0)}>
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-medium uppercase tracking-wider text-white/30">
              Scenario Question
            </span>
          </div>
          <p className="text-[17px] font-semibold leading-relaxed text-white/90 mb-auto">
            A player commits a challenge from behind using excessive force. The ball was won cleanly, but the follow-through injures the opponent. What is the correct decision?
          </p>

          <div className="flex flex-col gap-2.5 mt-6">
            {options.map((opt, i) => {
              const isCorrect = opt.label === 'B'
              const revealed = answerRevealed && isCorrect
              const shouldShow = showOptions && phaseTime > 400 + i * 200
              return (
                <div
                  key={opt.label}
                  className={`flex items-center gap-3 rounded-xl border px-5 py-3.5 text-[14px] transition-all duration-500 ${
                    revealed
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                      : 'border-white/8 text-white/50'
                  }`}
                  style={{
                    opacity: shouldShow ? 1 : 0,
                    transform: shouldShow ? 'translateX(0)' : 'translateX(-16px)',
                    transition: 'opacity 0.35s ease, transform 0.35s ease, border-color 0.5s, background-color 0.5s, color 0.5s',
                  }}
                >
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    revealed ? 'border-emerald-500/50 bg-emerald-500/20' : 'border-white/10'
                  }`}>
                    {revealed ? <Check className="h-3.5 w-3.5" /> : opt.label}
                  </span>
                  <span>{opt.text}</span>
                </div>
              )
            })}
          </div>

          <div
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-4 py-1.5 text-sm font-semibold text-emerald-400"
            style={{
              opacity: correctBadge ? 1 : 0,
              transform: correctBadge ? 'scale(1)' : 'scale(0.85)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            <Check className="h-4 w-4" /> Correct — Law 12
          </div>
        </div>

        {/* === Phase 1: Quiz Progress === */}
        <div style={phaseStyle(1)}>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-medium uppercase tracking-wider text-white/30">
              Quiz Progress
            </span>
          </div>
          <p className="text-[17px] font-semibold text-white/90 mb-6">
            Law 12 — Fouls &amp; Misconduct
          </p>

          {/* Progress bar */}
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/8 mb-8">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{ width: `${progressPct}%`, transition: 'width 0.1s linear' }}
            />
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between flex-1">
            <div>
              <p className="text-white/40 text-sm mb-1">Correct answers</p>
              <p className="text-3xl font-bold text-white/90">{correctCount}<span className="text-lg text-white/30 font-normal"> / 15</span></p>
              <div className="flex gap-1 mt-3">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-full rounded-full transition-colors duration-300 ${
                      i < correctCount ? 'bg-purple-500' : 'bg-white/8'
                    }`}
                    style={{ maxWidth: 16 }}
                  />
                ))}
              </div>
            </div>

            {/* Accuracy ring */}
            <div className="relative flex items-center justify-center">
              <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
                <circle cx="60" cy="60" r={ringR} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r={ringR}
                  fill="none" stroke="url(#heroRingGrad)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={ringC}
                  strokeDashoffset={ringOffset}
                  style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                />
                <defs>
                  <linearGradient id="heroRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-white/90">{accuracyRing}%</span>
                <span className="text-[10px] text-white/30">accuracy</span>
              </div>
            </div>
          </div>
        </div>

        {/* === Phase 2: Analytics Dashboard === */}
        <div style={phaseStyle(2)}>
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-medium uppercase tracking-wider text-white/30">
              Performance Analytics
            </span>
          </div>
          <p className="text-[17px] font-semibold text-white/90 mb-6">Your weekly breakdown</p>

          {/* Bar charts — full width, taller */}
          <div className="flex items-end gap-3 flex-1 mb-6" style={{ minHeight: 160 }}>
            {[
              { value: bar1, label: 'Law 12', sub: 'Fouls' },
              { value: bar2, label: 'Law 11', sub: 'Offside' },
              { value: bar3, label: 'Law 5', sub: 'Referee' },
              { value: bar4, label: 'Law 14', sub: 'Penalties' },
              { value: bar5, label: 'Law 13', sub: 'Free kicks' },
            ].map((bar, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-semibold text-white/60">{bar.value}%</span>
                <div className="relative w-full overflow-hidden rounded-lg bg-white/[0.04]" style={{ height: 140 }}>
                  <div
                    className="absolute bottom-0 w-full rounded-lg bg-gradient-to-t from-purple-600/80 to-pink-500/60"
                    style={{ height: `${bar.value}%`, transition: 'height 0.15s linear' }}
                  />
                </div>
                <span className="text-[11px] font-medium text-white/40">{bar.label}</span>
                <span className="text-[9px] text-white/20 -mt-1">{bar.sub}</span>
              </div>
            ))}
          </div>

          {/* Bottom stats */}
          <div className="flex items-center gap-6 pt-4 border-t border-white/8">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-400" />
              <span className="text-2xl font-bold text-white/90">{streak}</span>
              <span className="text-sm text-white/40">day streak</span>
            </div>
            <div className="h-5 w-px bg-white/10" />
            <div>
              <span className="text-2xl font-bold text-white/90">{overallAcc}%</span>
              <span className="text-sm text-white/40 ml-2">overall accuracy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Phase dots */}
      <div className="mt-5 flex justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              phase === i ? 'w-6 bg-purple-500' : 'w-1.5 bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
