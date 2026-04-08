import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollAnimate } from '@/components/marketing/scroll-animate'
import { Shield, ArrowRight, BookOpen, Target, Brain, CheckSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Match Preparation — RefZone',
  description:
    'Be ready for every match with RefZone\'s pre-match preparation guide. Review your checklist, warm up mentally, and practice scenarios before kick-off.',
}

const checklist = [
  {
    title: 'Review recent law changes',
    description: 'Check for any new IFAB circulars or competition-specific rules that apply to the match.',
  },
  {
    title: 'Check match details',
    description: 'Confirm the venue, kick-off time, teams, competition, and any special regulations.',
  },
  {
    title: 'Review team sheets',
    description: 'Familiarise yourself with player names, numbers, and any known disciplinary records.',
  },
  {
    title: 'Inspect equipment',
    description: 'Whistle, cards, coin, watch, flags, notebook, spare laces — check everything twice.',
  },
  {
    title: 'Warm up physically',
    description: 'Dynamic stretches, short sprints, and movement drills to prepare your body for 90 minutes.',
  },
  {
    title: 'Mental preparation',
    description: 'Visualise key scenarios, review your positioning plan, and set your focus for the match.',
  },
  {
    title: 'Arrive early',
    description: 'Give yourself time to inspect the pitch, meet team officials, and brief your assistants.',
  },
]

const features = [
  {
    icon: BookOpen,
    title: 'Law revision on the go',
    description: 'Quick-fire quizzes you can do in the car park before a match to refresh your memory on key laws.',
  },
  {
    icon: Target,
    title: 'Scenario warm-ups',
    description: 'Run through 5 match scenarios in under 10 minutes to get your decision-making sharp before kick-off.',
  },
  {
    icon: Brain,
    title: 'Confidence through preparation',
    description: 'Consistent pre-match routines build confidence. Track your preparation streak and stay disciplined.',
  },
]

export default function MatchPreparationPage() {
  return (
    <main>
      {/* Hero */}
      <section
        className="relative overflow-hidden px-9 pt-40 pb-20 md:pt-48 md:pb-28"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-600/10 to-transparent blur-3xl" />
        </div>
        <div className="mx-auto max-w-[1420px] text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.05]">
            <Shield className="h-8 w-8 text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Be ready for every match
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-white/45">
            The best referees prepare the same way every time. Use this
            pre-match checklist and let RefZone sharpen your mind before
            kick-off.
          </p>
          <div className="mt-8 flex items-center justify-center gap-1.5">
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
            <div className="h-0.5 w-12 rounded-full bg-white/20" />
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
          </div>
        </div>
      </section>

      {/* Pre-match checklist */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <h2 className="mb-2 text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
              Pre-match checklist
            </h2>
            <p className="mx-auto mb-10 max-w-lg text-center text-[14px] leading-relaxed text-white/45">
              Work through these seven steps before every match to make sure you
              are physically, mentally, and administratively prepared.
            </p>
          </ScrollAnimate>
          <div className="mx-auto max-w-2xl space-y-4">
            {checklist.map((item, i) => (
              <ScrollAnimate key={item.title} delay={i * 60}>
                <div className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.05] p-5 transition hover:border-purple-400/40">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-purple-400/10">
                    <CheckSquare className="h-4.5 w-4.5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/45">{item.description}</p>
                  </div>
                </div>
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="mx-auto max-w-[1420px] px-6">
        <div className="flex items-center justify-center py-4">
          <div className="h-px flex-1 bg-white/[0.05]" />
          <div className="mx-4 h-1.5 w-1.5 rotate-45 rounded-sm bg-white/10" />
          <div className="h-px flex-1 bg-white/[0.05]" />
        </div>
      </div>

      {/* How RefZone helps */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
              How RefZone helps you prepare
            </h2>
          </ScrollAnimate>
          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((feat, i) => {
              const Icon = feat.icon
              return (
                <ScrollAnimate key={feat.title} delay={i * 80}>
                  <div className="feature-item rounded-xl border border-white/10 bg-white/[0.05] p-6">
                    <Icon className="mb-4 h-8 w-8 text-pink-400" />
                    <h3 className="mb-2 font-semibold text-white">{feat.title}</h3>
                    <p className="text-sm leading-relaxed text-white/45">{feat.description}</p>
                  </div>
                </ScrollAnimate>
              )
            })}
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="mx-auto max-w-[1420px] px-6">
        <div className="flex items-center justify-center py-4">
          <div className="h-px flex-1 bg-white/[0.05]" />
          <div className="mx-4 h-1.5 w-1.5 rotate-45 rounded-sm bg-white/10" />
          <div className="h-px flex-1 bg-white/[0.05]" />
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px] text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Sharpen your mind before kick-off
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/45">
            Run through quick scenarios and law quizzes to arrive at your next
            match confident and prepared.
          </p>
          <Link
            href="/auth/sign-up"
            className="mt-6 inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
          >
            Practice scenarios before your next match
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
