import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollAnimate } from '@/components/marketing/scroll-animate'
import { GraduationCap, ArrowRight, UserPlus, BookOpen, Target, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Getting Started — RefZone',
  description:
    'New to RefZone? Follow our step-by-step guide to create your account, take your first quiz, try a scenario, and start tracking your progress.',
}

const steps = [
  {
    num: 1,
    title: 'Create your account',
    description:
      'Sign up in under a minute with your email or social login. Choose your experience level and the laws you want to focus on — we tailor your dashboard from day one.',
    icon: UserPlus,
  },
  {
    num: 2,
    title: 'Take your first quiz',
    description:
      'Jump straight into a quick 10-question quiz on the Laws of the Game. Every question comes with an instant explanation so you learn as you go.',
    icon: BookOpen,
  },
  {
    num: 3,
    title: 'Try a scenario',
    description:
      'Experience a real match situation — read the context, make your call, and receive instant expert feedback explaining the correct decision and the law behind it.',
    icon: Target,
  },
  {
    num: 4,
    title: 'Track your progress',
    description:
      'Visit your dashboard to see accuracy trends, streaks, and law-by-law breakdowns. Set weekly goals and watch your knowledge grow over time.',
    icon: BarChart3,
  },
]

export default function GettingStartedPage() {
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
            <GraduationCap className="h-8 w-8 text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Your referee journey starts here
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-white/45">
            Four simple steps to get up and running on RefZone. Whether you are a
            brand-new referee or a seasoned official, the path is the same.
          </p>
          <div className="mt-8 flex items-center justify-center gap-1.5">
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
            <div className="h-0.5 w-12 rounded-full bg-white/20" />
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <div className="space-y-0">
            {steps.map((step, i) => {
              const Icon = step.icon
              const reversed = i % 2 === 1
              const isLast = i === steps.length - 1
              return (
                <div key={step.num}>
                  <ScrollAnimate delay={i * 80}>
                    <div className={`grid gap-10 md:grid-cols-2 md:items-center ${reversed ? 'direction-rtl' : ''}`}>
                      <div className={reversed ? 'md:order-2' : ''}>
                        <div className="mb-4 flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-sm font-bold text-white">
                            {step.num}
                          </span>
                          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                            {step.title}
                          </h2>
                        </div>
                        <p className="text-[14px] leading-relaxed text-white/45">
                          {step.description}
                        </p>
                      </div>
                      <div className={`flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] p-10 ${reversed ? 'md:order-1' : ''}`}>
                        <Icon className="h-20 w-20 text-purple-400/40" strokeWidth={1.2} />
                      </div>
                    </div>
                  </ScrollAnimate>
                  {!isLast && (
                    <div className="mx-auto h-8 w-px border-l-2 border-dashed border-white/10" />
                  )}
                </div>
              )
            })}
          </div>

          {/* Completion checkmark */}
          <div className="mt-10 flex justify-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="23" stroke="#9114af" strokeWidth="2" opacity="0.2" />
              <circle cx="24" cy="24" r="18" fill="#9114af" fillOpacity="0.1" />
              <path d="M16 24.5L21.5 30L32 19" stroke="#9114af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
            Ready to begin?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/45">
            Create your free account and take your first quiz in under two
            minutes.
          </p>
          <Link
            href="/auth/sign-up"
            className="mt-6 inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
          >
            Create your free account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
