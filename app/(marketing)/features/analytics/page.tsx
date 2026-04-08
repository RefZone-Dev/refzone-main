import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollAnimate } from '@/components/marketing/scroll-animate'
import { BarChart3, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Performance Analytics — RefZone',
  description:
    'Track your referee training progress with detailed analytics. Accuracy breakdowns, law-by-law stats, and daily activity trends.',
}

export default function AnalyticsPage() {
  return (
    <main>
      {/* Hero */}
      <section
        className="relative overflow-hidden px-9 pt-40 pb-20 md:pt-48 md:pb-28"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-600/10 to-transparent blur-3xl" />
          <div className="absolute -bottom-20 right-[20%] h-[300px] w-[300px] rounded-full bg-pink-600/5 blur-3xl" />
        </div>
        <div className="absolute top-24 left-16 h-1 w-1 rounded-full bg-purple-500/30 animate-pulse-glow" />
        <div className="absolute top-36 right-20 h-1.5 w-1.5 rounded-full bg-pink-500/20 animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="mx-auto max-w-[1420px] text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.05]">
            <BarChart3 className="h-8 w-8 text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            See exactly where you stand
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-white/45">
            Detailed performance analytics show your strengths, weaknesses, and
            progress over time. Data-driven improvement for every referee.
          </p>
          <Link
            href="/auth/sign-up"
            className="mt-8 inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
          >
            View your analytics
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="mt-8 flex items-center justify-center gap-1.5">
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
            <div className="h-0.5 w-12 rounded-full bg-white/20" />
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      {/* Stat badges */}
      <div className="border-b border-white/[0.06] px-9 py-6">
        <div className="mx-auto flex max-w-[1420px] flex-wrap items-center justify-center gap-6 text-sm text-white/45">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Real-time tracking
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            Law-by-law breakdown
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-pink-500" />
            7-day charts
          </span>
        </div>
      </div>

      {/* Section 1 — Accuracy dashboard */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-white/20">
                  At a glance
                </span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Accuracy dashboard
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-white/45">
                  Your overall accuracy is front and centre, broken down by
                  quizzes, scenarios, and difficulty level. Watch the ring fill
                  as you improve.
                </p>
              </div>
              <div className="glass-card rounded-2xl border border-white/10 bg-white/[0.05] p-6">
                {/* Mock accuracy ring */}
                <div className="flex items-center justify-center gap-8">
                  <div className="relative">
                  <svg viewBox="0 0 120 120" className="h-36 w-36" aria-hidden="true">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#1e1230" strokeWidth="10" />
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="url(#acc-grad)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${0.87 * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
                      transform="rotate(-90 60 60)"
                    />
                    <defs>
                      <linearGradient id="acc-grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                    <text x="60" y="72" textAnchor="middle" fill="#9ca3af" fontSize="10">overall</text>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center" style={{ marginTop: '-8px' }}>
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-[28px] font-extrabold text-transparent">87%</span>
                  </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Quizzes', val: '91%', color: 'bg-purple-500' },
                      { label: 'Scenarios', val: '82%', color: 'bg-pink-500' },
                      { label: 'Hard mode', val: '74%', color: 'bg-purple-400' },
                    ].map((s) => (
                      <div key={s.label}>
                        <div className="mb-1 flex items-center justify-between text-xs text-white/20">
                          <span>{s.label}</span>
                          <span className="font-semibold text-white">{s.val}</span>
                        </div>
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-white/[0.05]">
                          <div
                            className={`h-full rounded-full ${s.color}`}
                            style={{ width: s.val }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-[1420px] px-6">
        <div className="flex items-center justify-center py-4">
          <div className="h-px flex-1 bg-white/[0.05]" />
          <div className="mx-4 h-1.5 w-1.5 rotate-45 rounded-sm bg-white/10" />
          <div className="h-px flex-1 bg-white/[0.05]" />
        </div>
      </div>

      {/* Section 2 — Law-by-law breakdown */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div className="order-2 md:order-1 glass-card rounded-2xl border border-white/10 bg-white/[0.05] p-6">
                {/* Mock horizontal bar chart */}
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/20">
                  Accuracy by law
                </h3>
                <svg viewBox="0 0 360 220" className="w-full" aria-hidden="true">
                  {[
                    { law: 'Law 11 — Offside', pct: 94 },
                    { law: 'Law 12 — Fouls', pct: 88 },
                    { law: 'Law 5 — The Referee', pct: 85 },
                    { law: 'Law 14 — Penalty', pct: 79 },
                    { law: 'Law 3 — Players', pct: 72 },
                    { law: 'Law 7 — Duration', pct: 68 },
                  ].map((row, i) => {
                    const y = i * 36 + 4
                    return (
                      <g key={row.law}>
                        <text x="0" y={y + 14} fill="#9ca3af" fontSize="10">{row.law}</text>
                        <rect x="140" y={y} width="180" height="18" rx="4" fill="#1e1230" />
                        <rect
                          x="140"
                          y={y}
                          width={180 * (row.pct / 100)}
                          height="18"
                          rx="4"
                          fill={`url(#bar-grad-${i})`}
                        />
                        <text x={140 + 180 * (row.pct / 100) + 6} y={y + 13} fill="#e0e0e0" fontSize="10" fontWeight="700">
                          {row.pct}%
                        </text>
                        <defs>
                          <linearGradient id={`bar-grad-${i}`} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </g>
                    )
                  })}
                </svg>
              </div>
              <div className="order-1 md:order-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/20">
                  Pinpoint weaknesses
                </span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Law-by-law breakdown
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-white/45">
                  See your accuracy for each of the 17 Laws. Quickly identify
                  which areas need more study and get recommended quizzes to
                  improve your weakest spots.
                </p>
              </div>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-[1420px] px-6">
        <div className="flex items-center justify-center py-4">
          <div className="h-px flex-1 bg-white/[0.05]" />
          <div className="mx-4 h-1.5 w-1.5 rotate-45 rounded-sm bg-white/10" />
          <div className="h-px flex-1 bg-white/[0.05]" />
        </div>
      </div>

      {/* Section 3 — 7-day activity */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-white/20">
                  Stay consistent
                </span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  7-day activity tracker
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-white/45">
                  Track your daily questions answered, time spent, and accuracy
                  trends. A quick glance tells you whether you are on pace for
                  the week.
                </p>
              </div>
              <div className="glass-card rounded-2xl border border-white/10 bg-white/[0.05] p-6">
                {/* Mock bar/line chart */}
                <div className="mb-4 flex items-center justify-between text-xs text-white/20">
                  <span>Questions answered — last 7 days</span>
                  <span className="font-semibold text-pink-400">142 total</span>
                </div>
                <svg viewBox="0 0 320 140" className="w-full" aria-hidden="true">
                  {/* Grid lines */}
                  {[0, 1, 2, 3].map((i) => (
                    <line
                      key={i}
                      x1="30"
                      y1={20 + i * 30}
                      x2="310"
                      y2={20 + i * 30}
                      stroke="#1e1230"
                      strokeWidth="1"
                    />
                  ))}
                  {/* Y labels */}
                  {['30', '20', '10', '0'].map((l, i) => (
                    <text key={l} x="20" y={25 + i * 30} textAnchor="end" fill="#ffffff60" fontSize="9">{l}</text>
                  ))}
                  {/* Bars */}
                  {[
                    { day: 'Mon', val: 22 },
                    { day: 'Tue', val: 18 },
                    { day: 'Wed', val: 28 },
                    { day: 'Thu', val: 15 },
                    { day: 'Fri', val: 25 },
                    { day: 'Sat', val: 12 },
                    { day: 'Sun', val: 22 },
                  ].map((d, i) => {
                    const barH = (d.val / 30) * 90
                    const x = 46 + i * 40
                    return (
                      <g key={d.day}>
                        <rect
                          x={x}
                          y={110 - barH}
                          width="24"
                          height={barH}
                          rx="4"
                          fill="url(#act-grad)"
                          opacity={0.7 + (d.val / 30) * 0.3}
                        />
                        <text x={x + 12} y={128} textAnchor="middle" fill="#ffffff60" fontSize="9">{d.day}</text>
                      </g>
                    )
                  })}
                  {/* Accuracy trend line */}
                  <polyline
                    points="58,42 98,50 138,30 178,55 218,36 258,62 298,42"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {[
                    [58, 42], [98, 50], [138, 30], [178, 55], [218, 36], [258, 62], [298, 42],
                  ].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="3" fill="#ec4899" />
                  ))}
                  <defs>
                    <linearGradient id="act-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="mt-2 flex justify-between text-xs text-white/20">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-purple-500" /> Questions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-pink-500" /> Accuracy trend
                  </span>
                </div>
              </div>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px] text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Know your numbers, improve faster
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/45">
            Detailed analytics turn practice into measurable progress. Start
            tracking today.
          </p>
          <div className="relative mt-6 inline-block">
            <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl" />
            <Link
              href="/auth/sign-up"
              className="relative inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
            >
              View your analytics
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
