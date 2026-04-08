import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollAnimate } from '@/components/marketing/scroll-animate'
import { BookOpen, ArrowRight, CheckCircle, XCircle, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Quiz Library — RefZone',
  description:
    '500+ questions covering all 17 Laws of the Game. Test your knowledge at three difficulty levels with instant feedback.',
}

export default function QuizzesPage() {
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
            <BookOpen className="h-8 w-8 text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Master every law
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-white/45">
            Over 500 carefully crafted questions covering all 17 Laws of the
            Game. From basic rules to match-day edge cases — test yourself at
            any level.
          </p>
          <Link
            href="/auth/sign-up"
            className="mt-8 inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
          >
            Start a quiz
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
            500+ questions
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            3 difficulty levels
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-pink-500" />
            Instant explanations
          </span>
        </div>
      </div>

      {/* Section 1 — 500+ questions */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-white/20">
                  Comprehensive coverage
                </span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  500+ expertly written questions
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-white/45">
                  Every question is mapped to a specific Law and reviewed by
                  experienced referees. The library grows every month with new
                  questions based on real match incidents.
                </p>
              </div>
              <div className="glass-card rounded-2xl border border-white/10 bg-white/[0.05] p-6">
                {/* Mock quiz interface */}
                <div className="mb-3 flex items-center justify-between text-xs text-white/20">
                  <span>Question 7 of 20</span>
                  <span className="font-semibold text-pink-400">Law 11 — Offside</span>
                </div>
                <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-white/[0.05]">
                  <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                </div>
                <p className="mb-5 text-sm font-medium text-white">
                  An attacker in an offside position receives a deliberate pass
                  from an opponent. Is this offside?
                </p>
                <div className="space-y-2">
                  {[
                    { label: 'Yes — offside applies regardless of the source', selected: false },
                    { label: 'No — a deliberate play resets the offside', selected: true },
                    { label: 'Only if the attacker is in the penalty area', selected: false },
                    { label: 'Referee discretion based on advantage', selected: false },
                  ].map((opt, i) => (
                    <button
                      key={i}
                      className={`flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left text-sm font-medium transition ${
                        opt.selected
                          ? 'border-purple-500 bg-purple-400/10 text-pink-400'
                          : 'border-white/10 bg-white/[0.05] text-white hover:border-purple-400/30'
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                          opt.selected
                            ? 'border-purple-500 bg-purple-500 text-white'
                            : 'border-white/10 text-white/20'
                        }`}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt.label}
                    </button>
                  ))}
                </div>
                <button className="mt-4 w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-black hover:bg-white/90">
                  Submit answer
                </button>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <div className="h-3 w-3 rounded-full bg-purple-500 ring-4 ring-purple-500/20" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
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

      {/* Section 2 — Three difficulty levels */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/20">
                For every skill level
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Three difficulty levels
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-[14px] leading-relaxed text-white/45">
                Start with the basics and work your way up to competition-grade
                questions that challenge even the most experienced referees.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  level: 'Easy',
                  stars: 1,
                  color: 'text-green-400',
                  bg: 'bg-green-500/10',
                  border: 'border-green-500/30',
                  desc: 'Core rules and straightforward situations. Perfect for new referees starting their journey.',
                  count: '180+ questions',
                },
                {
                  level: 'Medium',
                  stars: 2,
                  color: 'text-yellow-400',
                  bg: 'bg-yellow-500/10',
                  border: 'border-yellow-500/30',
                  desc: 'Nuanced scenarios that require deeper understanding of the Laws and their practical application.',
                  count: '200+ questions',
                },
                {
                  level: 'Hard',
                  stars: 3,
                  color: 'text-red-400',
                  bg: 'bg-red-500/10',
                  border: 'border-red-500/30',
                  desc: 'Edge cases, rare situations, and tricky interactions between Laws. Competition-level difficulty.',
                  count: '120+ questions',
                },
              ].map((d) => (
                <div
                  key={d.level}
                  className={`rounded-2xl border ${d.border} ${d.bg} p-6`}
                >
                  <div className="mb-3 flex gap-1">
                    {Array.from({ length: 3 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < d.stars ? d.color : 'text-white/20/30'}`}
                        fill={i < d.stars ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <h3 className={`text-lg font-bold ${d.color}`}>{d.level}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/45">
                    {d.desc}
                  </p>
                  <span className="mt-4 inline-block text-xs font-semibold text-white/20">
                    {d.count}
                  </span>
                </div>
              ))}
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

      {/* Section 3 — Instant feedback */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-white/20">
                  Learn as you go
                </span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Instant feedback on every answer
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-white/45">
                  Right or wrong, you get an immediate explanation citing the
                  exact Law and section. Bookmark tricky questions to revisit
                  them later.
                </p>
              </div>
              <div className="space-y-4">
                {/* Correct answer card */}
                <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-semibold text-green-400">Correct!</span>
                  </div>
                  <p className="text-sm leading-relaxed text-white/45">
                    <span className="font-semibold text-white">Law 11.3:</span>{' '}
                    A player is not offside if they receive the ball from an
                    opponent who deliberately plays it (except a deliberate save).
                  </p>
                </div>
                {/* Incorrect answer card */}
                <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-semibold text-red-400">Incorrect</span>
                  </div>
                  <p className="text-sm leading-relaxed text-white/45">
                    <span className="font-semibold text-white">You answered:</span>{' '}
                    Indirect free kick. The correct restart is a{' '}
                    <span className="font-semibold text-white">dropped ball</span>{' '}
                    because the ball struck the referee and changed possession.{' '}
                    <span className="text-pink-400">See Law 9.1</span>
                  </p>
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
            Test your knowledge of the Laws
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/45">
            500+ questions across every Law of the Game. How well do you really
            know the rules?
          </p>
          <div className="relative mt-6 inline-block">
            <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl" />
            <Link
              href="/auth/sign-up"
              className="relative inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
            >
              Start a quiz
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
