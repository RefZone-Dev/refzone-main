import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollAnimate } from '@/components/marketing/scroll-animate'
import { Brain, ArrowRight, BookMarked, Clock, Zap, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Decision Lab — RefZone',
  description:
    'Your specialised referee mentor, built on the Laws of the Game. Ask any question and get instant, detailed analysis with law references.',
}

export default function DecisionLabPage() {
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
            <Brain className="h-8 w-8 text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Your specialised referee mentor
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-white/45">
            Ask any question about the Laws of the Game and receive instant,
            expert-level analysis with precise law references. Like having a FIFA
            instructor in your pocket.
          </p>
          <Link
            href="/auth/sign-up"
            className="mt-8 inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
          >
            Try Decision Lab
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
            24/7 available
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            Any scenario
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-pink-500" />
            Law references included
          </span>
        </div>
      </div>

      {/* Section 1 — Ask anything */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-white/20">
                  Natural conversation
                </span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Ask anything about the Laws
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-white/45">
                  Type your question in plain language — describe a match
                  situation, ask about a specific law, or explore hypothetical
                  scenarios. Decision Lab understands context and gives you
                  precise, actionable answers.
                </p>
              </div>
              <div className="glass-card rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                {/* Mock chat interface */}
                <div className="space-y-4">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-md bg-white/[0.05] px-4 py-3 text-sm text-white">
                      A goalkeeper picks up a back-pass that was headed by their
                      teammate. Is that allowed?
                    </div>
                  </div>
                  {/* AI response */}
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.05]">
                      <Brain className="h-4 w-4 text-pink-400" />
                    </div>
                    <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.05] px-4 py-3 text-sm leading-relaxed text-white/45">
                      <p className="mb-2">
                        <span className="font-semibold text-white">Yes, this is allowed.</span>{' '}
                        The back-pass rule (Law 12.2) only applies when the ball
                        is deliberately <em>kicked</em> to the goalkeeper by a
                        teammate.
                      </p>
                      <p className="mb-2">
                        A header, chest, or knee pass is <span className="font-semibold text-green-400">permitted</span>{' '}
                        — the goalkeeper may handle it without penalty.
                      </p>
                      <div className="mt-3 rounded-lg bg-purple-400/10 px-3 py-2 text-xs text-pink-400">
                        <BookMarked className="mb-1 inline h-3 w-3" /> Law 12,
                        Section 2 — Indirect free kick offences
                      </div>
                    </div>
                  </div>
                  {/* Follow-up user */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-md bg-white/[0.05] px-4 py-3 text-sm text-white">
                      What if the teammate flicked it with their foot on purpose?
                    </div>
                  </div>
                  {/* AI typing indicator */}
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.05]">
                      <Brain className="h-4 w-4 text-pink-400" />
                    </div>
                    <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.05] px-4 py-3">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 rounded-full bg-purple-500/40" style={{ animation: 'bounce-subtle 1s ease-in-out infinite' }} />
                        <div className="h-2 w-2 rounded-full bg-purple-500/40" style={{ animation: 'bounce-subtle 1s ease-in-out 0.15s infinite' }} />
                        <div className="h-2 w-2 rounded-full bg-purple-500/40" style={{ animation: 'bounce-subtle 1s ease-in-out 0.3s infinite' }} />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Input bar */}
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5">
                  <MessageCircle className="h-4 w-4 text-white/20" />
                  <span className="text-sm text-white/20">Ask a question...</span>
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

      {/* Section 2 — Deep analysis */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div className="order-2 md:order-1 glass-card rounded-2xl border border-white/10 bg-white/[0.05] p-6">
                {/* Mock analysis panel */}
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/20">
                  Analysis breakdown
                </h3>
                <div className="space-y-4">
                  {[
                    { law: 'Law 12.2', title: 'Indirect free kick offences', relevance: 95 },
                    { law: 'Law 12.1', title: 'Direct free kick offences', relevance: 40 },
                    { law: 'Law 13', title: 'Free kicks — procedure', relevance: 30 },
                  ].map((ref) => (
                    <div key={ref.law} className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-semibold text-pink-400">{ref.law}</span>
                        <span className="text-xs text-white/20">{ref.relevance}% relevance</span>
                      </div>
                      <p className="text-sm font-medium text-white">{ref.title}</p>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                          style={{ width: `${ref.relevance}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg bg-purple-400/10 px-4 py-3 text-sm text-white/45">
                  <span className="font-semibold text-pink-400">Verdict:</span>{' '}
                  Indirect free kick from where the goalkeeper handled the ball.
                  No card required unless tactical.
                </div>
              </div>
              <div className="order-1 md:order-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/20">
                  Beyond simple answers
                </span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Deep analysis with law references
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-white/45">
                  Decision Lab does not just give you a yes/no answer. It breaks
                  down which Laws apply, rates their relevance, and explains the
                  reasoning chain so you truly understand the decision.
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

      {/* Section 3 — Available 24/7 */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/20">
                Always ready
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Available 24/7
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-[14px] leading-relaxed text-white/45">
                Whether it is midnight before a big match or half-time during
                training, Decision Lab is always ready to help.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: Clock,
                  title: 'Instant responses',
                  desc: 'Get detailed analysis in seconds, not hours. No waiting for a mentor to reply.',
                },
                {
                  icon: BookMarked,
                  title: 'Always up to date',
                  desc: 'Built on the latest IFAB Laws of the Game including all recent amendments.',
                },
                {
                  icon: Zap,
                  title: 'Unlimited questions',
                  desc: 'Ask as many questions as you want. There is no daily limit on learning.',
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="glass-card rounded-2xl border border-white/10 bg-white/[0.05] p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/15">
                    <card.icon className="h-5 w-5 text-pink-400" />
                  </div>
                  <h3 className="text-base font-bold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/45">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px] text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Get expert answers in seconds
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/45">
            Your specialised referee mentor is ready. Ask your first question
            today.
          </p>
          <div className="relative mt-6 inline-block">
            <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl" />
            <Link
              href="/auth/sign-up"
              className="relative inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
            >
              Try Decision Lab
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
