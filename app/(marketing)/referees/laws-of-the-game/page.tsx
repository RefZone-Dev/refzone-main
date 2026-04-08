import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollAnimate } from '@/components/marketing/scroll-animate'
import { BookOpen, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Laws of the Game — RefZone',
  description:
    'RefZone covers all 17 Laws of the Game with quizzes, scenarios, and in-depth explanations. Master every law from the Field of Play to the Corner Kick.',
}

const laws = [
  { num: 1, title: 'The Field of Play', desc: 'Pitch dimensions, markings, goals, and surfaces.' },
  { num: 2, title: 'The Ball', desc: 'Size, weight, pressure, and replacement procedures.' },
  { num: 3, title: 'The Players', desc: 'Number of players, substitutions, and team officers.' },
  { num: 4, title: 'The Players\' Equipment', desc: 'Required kit, prohibited items, and safety checks.' },
  { num: 5, title: 'The Referee', desc: 'Authority, decisions, responsibilities, and advantage.' },
  { num: 6, title: 'The Other Match Officials', desc: 'Assistant referees, fourth official, and VAR.' },
  { num: 7, title: 'The Duration of the Match', desc: 'Periods of play, half-time, and added time.' },
  { num: 8, title: 'The Start and Restart of Play', desc: 'Kick-off, dropped ball, and restart procedures.' },
  { num: 9, title: 'The Ball In and Out of Play', desc: 'When the ball is in play and when it is out.' },
  { num: 10, title: 'Determining the Outcome of a Match', desc: 'Goals scored, draws, and penalty shoot-outs.' },
  { num: 11, title: 'Offside', desc: 'Offside position, offence, and when there is no offence.' },
  { num: 12, title: 'Fouls and Misconduct', desc: 'Direct and indirect free kicks, cautions, and send-offs.' },
  { num: 13, title: 'Free Kicks', desc: 'Direct vs indirect, positioning, and wall procedures.' },
  { num: 14, title: 'The Penalty Kick', desc: 'Procedure, position of players, and infringements.' },
  { num: 15, title: 'The Throw-In', desc: 'Procedure, infringements, and restarts.' },
  { num: 16, title: 'The Goal Kick', desc: 'Procedure, position of players, and infringements.' },
  { num: 17, title: 'The Corner Kick', desc: 'Procedure, position of players, and infringements.' },
]

export default function LawsOfTheGamePage() {
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
            <BookOpen className="h-8 w-8 text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            All 17 Laws. Covered.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-white/45">
            RefZone provides quizzes, scenarios, and detailed explanations for
            every Law of the Game so you can master the full rulebook with
            confidence.
          </p>
          <div className="mt-8 flex items-center justify-center gap-1.5">
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
            <div className="h-0.5 w-12 rounded-full bg-white/20" />
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
          </div>
        </div>
      </section>

      {/* Law cards grid */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {laws.map((law, i) => (
              <ScrollAnimate key={law.num} delay={i * 40}>
                <div className={`flex gap-4 rounded-xl border border-white/10 bg-white/[0.05] p-5 transition hover:border-purple-400/40 ${law.num <= 4 ? 'border-l-2 border-l-green-400' : law.num <= 8 ? 'border-l-2 border-l-blue-400' : law.num <= 12 ? 'border-l-2 border-l-purple-500' : 'border-l-2 border-l-amber-400'}`}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-400/10 text-sm font-bold text-purple-400">
                    {law.num}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{law.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/45">{law.desc}</p>
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

      {/* Bottom CTA */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px] text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Think you know the Laws?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/45">
            Put your knowledge to the test with quizzes covering every law.
          </p>
          <Link
            href="/auth/sign-up"
            className="mt-6 inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
          >
            Test your knowledge
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
