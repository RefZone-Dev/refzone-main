import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollAnimate } from '@/components/marketing/scroll-animate'
import { Crosshair, ArrowRight, Flame, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Game Scenarios — RefZone',
  description:
    '100+ real-game decision-making scenarios with expert analysis. Practice match situations and sharpen your referee instincts with RefZone.',
}

export default function ScenariosPage() {
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
            <Crosshair className="h-8 w-8 text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Experience real match decisions
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-white/45">
            Over 100 algorithm-driven game scenarios recreate the pressure of real
            matches. Read the situation, make your call, and learn from instant
            expert analysis.
          </p>
          <Link
            href="/auth/sign-up"
            className="mt-8 inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
          >
            Start practicing scenarios
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
            100+ scenarios
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            17 laws covered
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-pink-500" />
            Instant expert feedback
          </span>
        </div>
      </div>

      {/* Section 1 — Realistic situations */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-white/20">
                  Immersive gameplay
                </span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Realistic match situations
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-white/45">
                  Each scenario drops you into a live match moment — a tackle in
                  the box, an off-the-ball incident, a controversial throw-in.
                  You get the context, the visuals, and three possible calls.
                  Choose wisely.
                </p>
              </div>
              <div className="glass-card rounded-2xl border border-white/10 bg-white/[0.05] p-6">
                {/* Mock scenario card */}
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/20">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                  Live scenario
                </div>
                <svg viewBox="0 0 400 160" className="mb-5 w-full" aria-hidden="true">
                  <rect width="400" height="160" rx="12" fill="#1e1230" />
                  {/* pitch lines */}
                  <rect x="20" y="20" width="360" height="120" rx="4" fill="none" stroke="#3b2660" strokeWidth="1.5" />
                  <line x1="200" y1="20" x2="200" y2="140" stroke="#3b2660" strokeWidth="1.5" />
                  <circle cx="200" cy="80" r="24" fill="none" stroke="#3b2660" strokeWidth="1.5" />
                  {/* penalty area */}
                  <rect x="20" y="40" width="60" height="80" fill="none" stroke="#3b2660" strokeWidth="1.5" />
                  <rect x="320" y="40" width="60" height="80" fill="none" stroke="#3b2660" strokeWidth="1.5" />
                  {/* players */}
                  <circle cx="130" cy="72" r="6" fill="#a855f7" />
                  <circle cx="145" cy="80" r="6" fill="#ec4899" />
                  <circle cx="140" cy="76" r="3" fill="#fff" opacity="0.8" />
                  {/* highlight zone */}
                  <circle cx="138" cy="76" r="18" fill="#a855f7" opacity="0.15" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 3" />
                  <text x="200" y="155" textAnchor="middle" fill="#9ca3af" fontSize="9">73rd minute · 1-1 · Penalty area challenge</text>
                </svg>
                <div className="mb-4 flex items-center gap-3">
                  <p className="text-sm font-medium text-white">
                    A defender slides in and makes contact with the attacker inside
                    the box. The ball was played moments before. What is your call?
                  </p>
                  <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1.5">
                    <svg viewBox="0 0 20 20" className="h-4 w-4 text-pink-400" aria-hidden="true">
                      <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M10 5v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                    <span className="text-xs font-bold text-pink-400">2:30</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {['Penalty kick + yellow card', 'Penalty kick — no card', 'No foul — fair challenge'].map(
                    (opt, i) => (
                      <button
                        key={i}
                        className="flex w-full items-center gap-3 rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-left text-sm font-medium text-white transition hover:border-purple-400/50"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 text-xs text-white/20">
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </button>
                    ),
                  )}
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

      {/* Section 2 — Algorithm-driven analysis */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div className="order-2 md:order-1 glass-card rounded-2xl border border-white/10 bg-white/[0.05] p-6">
                {/* Mock AI feedback panel */}
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-semibold text-green-400">Correct — Penalty kick, no card</span>
                </div>
                <div className="mb-4 h-px bg-white/[0.08]" />
                <div className="space-y-3 text-sm leading-relaxed text-white/45">
                  <p>
                    <span className="font-semibold text-pink-400">Law 12 — Fouls &amp; Misconduct:</span>{' '}
                    The defender made contact with the attacker carelessly, but
                    the challenge was not reckless enough to warrant a caution.
                  </p>
                  <p>
                    The ball had already been played, removing any argument that
                    the defender won the ball first. A penalty kick is the
                    correct restart.
                  </p>
                  <div className="rounded-lg bg-purple-400/10 px-4 py-3 text-pink-400">
                    <span className="font-semibold">Key takeaway:</span> Contact
                    alone does not equal a card. Assess the intensity, direction,
                    and proximity of the ball.
                  </div>
                </div>
                <div className="mt-4 flex gap-4 text-xs text-white/20">
                  <span>Accuracy: 78% of users got this right</span>
                  <span>·</span>
                  <span>Law 12 reference</span>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/20">
                  Learn from every call
                </span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Algorithm-driven analysis
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-white/45">
                  After every decision you receive a detailed breakdown — which
                  Law applies, why the correct answer is right, and the most
                  common mistakes other referees make on the same scenario.
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

      {/* Section 3 — Track your streaks */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-white/20">
                  Build consistency
                </span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Track your streaks
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-white/45">
                  Every correct call extends your streak. The longer your streak,
                  the more points you earn. Track daily activity on the calendar
                  and watch your consistency grow week over week.
                </p>
              </div>
              <div className="glass-card rounded-2xl border border-white/10 bg-white/[0.05] p-6">
                {/* Mock streak UI */}
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Flame className="h-8 w-8 text-orange-500" />
                    <div>
                      <div className="text-3xl font-extrabold text-white">12</div>
                      <div className="text-xs text-white/20">day streak</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-pink-400">87%</div>
                    <div className="text-xs text-white/20">accuracy</div>
                  </div>
                </div>
                {/* Mini calendar grid */}
                <div className="mb-2 text-xs font-semibold text-white/20">March 2026</div>
                <div className="grid grid-cols-7 gap-1.5">
                  {Array.from({ length: 31 }, (_, i) => {
                    const active = i >= 18
                    const today = i === 30
                    return (
                      <div
                        key={i}
                        className={`flex h-7 w-full items-center justify-center rounded text-xs font-medium ${
                          today
                            ? 'bg-purple-500 text-white'
                            : active
                              ? 'bg-purple-500/20 text-pink-400'
                              : 'bg-white/[0.05] text-white/20'
                        }`}
                      >
                        {i + 1}
                      </div>
                    )
                  })}
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
            Ready to sharpen your match instincts?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/45">
            Join thousands of referees practising real-game scenarios every day.
          </p>
          <div className="relative mt-6 inline-block">
            <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl" />
            <Link
              href="/auth/sign-up"
              className="relative inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
            >
              Start practicing scenarios
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
