import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollAnimate } from '@/components/marketing/scroll-animate'
import { Target, ArrowRight, FileText, Video, Zap, ClipboardList, Move, Dumbbell } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Training Resources — RefZone',
  description:
    'Access referee training resources including Laws of the Game PDFs, video tutorials, weekly challenges, positioning guides, and fitness standards.',
}

const resources = [
  {
    icon: FileText,
    title: 'Laws of the Game PDF',
    description: 'The official IFAB Laws of the Game document — always up to date for the current season.',
    link: 'https://www.theifab.com/laws-of-the-game/',
    linkLabel: 'View on IFAB',
    external: true,
    badge: null,
  },
  {
    icon: Video,
    title: 'Video tutorials',
    description: 'Walkthroughs of key match situations, positioning techniques, and law interpretations.',
    link: null,
    linkLabel: null,
    external: false,
    badge: 'Coming soon',
  },
  {
    icon: Zap,
    title: 'Weekly challenges',
    description: 'A fresh set of questions every week designed to test your knowledge on a specific law or theme.',
    link: '/auth/sign-up',
    linkLabel: 'Sign up to participate',
    external: false,
    badge: null,
  },
  {
    icon: ClipboardList,
    title: 'Pre-match preparation',
    description: 'Checklists and guides to make sure you arrive at every match confident and ready.',
    link: '/referees/match-preparation',
    linkLabel: 'View match prep guide',
    external: false,
    badge: null,
  },
  {
    icon: Move,
    title: 'Positioning guides',
    description: 'Diagrams and explanations for optimal referee and assistant referee positioning during play.',
    link: null,
    linkLabel: null,
    external: false,
    badge: 'Coming soon',
  },
  {
    icon: Dumbbell,
    title: 'Fitness standards',
    description: 'Reference information on the physical fitness tests required at each referee level in Australia.',
    link: null,
    linkLabel: null,
    external: false,
    badge: null,
  },
]

export default function TrainingResourcesPage() {
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
            <Target className="h-8 w-8 text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Everything you need to improve
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-white/45">
            Curated training resources to help you study the laws, sharpen your
            decision-making, and stay match-fit throughout the season.
          </p>
          <div className="mt-8 flex items-center justify-center gap-1.5">
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
            <div className="h-0.5 w-12 rounded-full bg-white/20" />
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
          </div>
        </div>
      </section>

      {/* Resource cards */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((res, i) => {
              const Icon = res.icon
              return (
                <ScrollAnimate key={res.title} delay={i * 60}>
                  <div className="flex h-full flex-col feature-item rounded-xl border border-white/10 bg-white/[0.05] p-6 transition hover:border-purple-400/40">
                    <div className="mb-4 flex items-center justify-between">
                      <Icon className="h-8 w-8 text-pink-400" />
                      {res.badge && (
                        <span className="rounded-full bg-purple-400/10 px-3 py-1 text-[11px] font-semibold text-purple-400">
                          {res.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="mb-2 font-semibold text-white">{res.title}</h3>
                    <p className="flex-1 text-sm leading-relaxed text-white/45">
                      {res.description}
                    </p>
                    {res.link && (
                      <Link
                        href={res.link}
                        {...(res.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-purple-400 hover:text-purple-300"
                      >
                        {res.linkLabel} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
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
            Ready to level up?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/45">
            Sign up for free and access quizzes, scenarios, and weekly
            challenges designed to make you a better referee.
          </p>
          <Link
            href="/auth/sign-up"
            className="mt-6 inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
          >
            Start training
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
