import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollAnimate } from '@/components/marketing/scroll-animate'
import { Award, ArrowRight, BookOpen, Target, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Career Development — RefZone',
  description:
    'Understand the referee career pathway in Australia — from community level to FIFA panel. Learn what it takes to progress and how RefZone supports you at every stage.',
}

const levels = [
  {
    level: 1,
    title: 'Community Referee',
    color: 'bg-emerald-500',
    description:
      'The starting point for every referee. Officiate local junior and senior community matches, build foundational knowledge of the Laws, and develop basic match-management skills.',
    skills: ['Laws of the Game basics', 'Positioning', 'Communication', 'Fitness'],
  },
  {
    level: 2,
    title: 'District Referee',
    color: 'bg-sky-500',
    description:
      'Take charge of higher-level district competitions. Demonstrate consistent decision-making, stronger fitness, and the ability to manage competitive matches under pressure.',
    skills: ['Advanced law application', 'Advantage play', 'Man-management', 'Report writing'],
  },
  {
    level: 3,
    title: 'State Referee',
    color: 'bg-violet-500',
    description:
      'Appointed to state-level leagues and knockout competitions. Requires passing fitness tests, attending development courses, and receiving positive assessor reports.',
    skills: ['Tactical awareness', 'Team officiating', 'Fitness standards', 'Mentoring'],
  },
  {
    level: 4,
    title: 'National Referee',
    color: 'bg-amber-500',
    description:
      'Officiate A-League, W-League, and national cup competitions. Referees at this level are assessed regularly and participate in national development camps.',
    skills: ['Elite fitness', 'VAR protocols', 'High-pressure management', 'Media awareness'],
  },
  {
    level: 5,
    title: 'FIFA Referee',
    color: 'bg-rose-500',
    description:
      'Represent Australia on the international stage. FIFA referees officiate AFC and FIFA competitions and must meet the highest physical and technical standards in the world.',
    skills: ['International protocols', 'Multi-language communication', 'Peak fitness', 'Cultural awareness'],
  },
]

const features = [
  {
    icon: BookOpen,
    title: 'Comprehensive quizzes',
    description: 'Targeted questions for every level — from community basics to advanced VAR protocols.',
  },
  {
    icon: Target,
    title: 'Match scenarios',
    description: 'Algorithm-driven scenarios that mirror the complexity and pressure of your current level.',
  },
  {
    icon: BarChart3,
    title: 'Progress tracking',
    description: 'See exactly where you stand on each law and identify gaps before your next assessment.',
  },
]

export default function CareerPage() {
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
            <Award className="h-8 w-8 text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Build your referee career
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-white/45">
            From your first community match to the FIFA panel — understand the
            pathway and develop the skills you need at every stage.
          </p>
          <div className="mt-8 flex items-center justify-center gap-1.5">
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
            <div className="h-0.5 w-12 rounded-full bg-white/20" />
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
          </div>
        </div>
      </section>

      {/* Progression timeline */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
              The Australian referee pathway
            </h2>
          </ScrollAnimate>
          <div className="relative ml-4 border-l-2 border-white/10 pl-8">
            {levels.map((item, i) => (
              <ScrollAnimate key={item.level} delay={i * 80}>
                <div className="relative mb-12 last:mb-0">
                  {/* Timeline dot */}
                  <div className="absolute -left-[13px] top-1">
                    <span className={`block h-4 w-4 rounded-full border-4 border-[#0a0a0f] ${item.color} ${item.level === 3 ? 'ring-4 ring-violet-500/20' : ''}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Level {item.level}: {item.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/45">{item.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.skills.map((s) => (
                      <span key={s} className="rounded-full bg-purple-400/10 px-3 py-1 text-xs font-medium text-purple-400">
                        {s}
                      </span>
                    ))}
                  </div>
                  {/* Arrow between levels */}
                  {i < levels.length - 1 && (
                    <div className="mt-4 flex justify-start">
                      <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 0V16M8 16L2 10M8 16L14 10" stroke="#9114af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
                      </svg>
                    </div>
                  )}
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
              How RefZone helps at every level
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
            Your next level starts today
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/45">
            Whether you are aiming for district or dreaming of FIFA, RefZone
            gives you the tools to get there.
          </p>
          <Link
            href="/auth/sign-up"
            className="mt-6 inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
          >
            Start your journey
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
