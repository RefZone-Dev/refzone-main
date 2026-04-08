import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollAnimate } from '@/components/marketing/scroll-animate'
import {
  ArrowRight,
  BookOpen,
  Brain,
  Target,
  Trophy,
  Users,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Zap,
  Flame,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About — RefZone',
  description:
    'Learn about RefZone — the advanced football referee training platform empowering referees through technology. Built in Australia for the global referee community.',
}

const features = [
  {
    icon: Target,
    title: 'Game Scenarios',
    description:
      'Algorithm-generated match situations that test your decision-making under pressure. Practice real-game incidents and learn from instant expert analysis.',
  },
  {
    icon: BookOpen,
    title: 'Laws of the Game Quizzes',
    description:
      'Structured knowledge tests covering all 17 Laws of the Game. Instant feedback, detailed explanations, and progress tracking across every law category.',
  },
  {
    icon: Brain,
    title: 'Decision Lab',
    description:
      'A specialised training assistant built on the Laws of the Game. Discuss scenarios, ask questions, and receive detailed analysis in real time.',
  },
  {
    icon: Trophy,
    title: 'Analytics',
    description:
      'Track your accuracy, streaks, and progress over time. Compare your performance with referees across Australia and measure your improvement.',
  },
]

const values = [
  {
    icon: ShieldCheck,
    title: 'Accuracy',
    description:
      'Every piece of content on RefZone is grounded in the official IFAB Laws of the Game. Our scenarios and quizzes are reviewed to ensure they reflect the current laws and their correct application.',
  },
  {
    icon: Users,
    title: 'Community',
    description:
      'Refereeing can be isolating. RefZone brings referees together — from grassroots volunteers to experienced panel officials — creating a space to learn, discuss, and grow alongside peers.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description:
      'We use modern technology and smart algorithms not to replace traditional training, but to enhance it. High-quality training accessible anytime, anywhere.',
  },
]

const stats = [
  { value: '500+', label: 'Quiz questions' },
  { value: '100+', label: 'Video scenarios' },
  { value: '17', label: 'Laws covered' },
  { value: '24/7', label: 'Training assistant' },
]

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden px-9 pt-40 pb-20 md:pt-48 md:pb-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-600/10 to-transparent blur-3xl" />
          <div className="absolute -bottom-20 right-[20%] h-[300px] w-[300px] rounded-full bg-pink-600/5 blur-3xl" />
        </div>
        <div className="absolute top-24 left-16 h-1 w-1 rounded-full bg-purple-500/30 animate-pulse-glow" />
        <div className="absolute top-36 right-20 h-1.5 w-1.5 rounded-full bg-pink-500/20 animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="mx-auto max-w-[1420px] text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            About RefZone
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/45">
            Empowering referees through technology. Algorithm-driven training for the
            modern match official.
          </p>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      {/* Stats bar */}
      <section className="border-b border-white/[0.06] px-9 py-12">
        <div className="mx-auto grid max-w-[1420px] grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold tracking-tight text-white md:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-white/45">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission — with large illustration */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="grid items-center gap-16 md:grid-cols-2">
              {/* Text */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-white/20">
                  Our mission
                </span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Empowering referees through technology
                </h2>
                <p className="mt-4 leading-relaxed text-white/45">
                  Referee training has traditionally relied on classroom sessions,
                  in-person mentoring, and match experience alone. While these
                  methods are invaluable, they are limited by availability, geography,
                  and time.
                </p>
                <p className="mt-3 leading-relaxed text-white/45">
                  RefZone was built to fill the gap — providing
                  high-quality, on-demand training that any referee can access from
                  anywhere, at any time. We believe every referee deserves the tools
                  to improve, regardless of their location or level.
                </p>
              </div>

              {/* Illustration — mock platform UI */}
              <div className="glass-card overflow-hidden p-1">
                <div className="rounded-xl bg-[#0a0a0f] p-6">
                  {/* Mini dashboard mock */}
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-red-500/60" />
                    <div className="h-2 w-2 rounded-full bg-yellow-500/60" />
                    <div className="h-2 w-2 rounded-full bg-green-500/60" />
                    <div className="ml-auto text-[10px] text-white/20">refzone.com.au</div>
                  </div>
                  <div className="space-y-4">
                    {/* Accuracy ring */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <svg width="80" height="80" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                          <circle cx="40" cy="40" r="32" fill="none" stroke="url(#about-ring)" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 32 * 0.87} ${2 * Math.PI * 32 * 0.13}`} transform="rotate(-90 40 40)" />
                          <defs><linearGradient id="about-ring" x1="0%" y1="0%" x2="100%"><stop offset="0%" stopColor="#a855f7"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs>
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">87%</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Overall Accuracy</p>
                        <p className="text-xs text-white/45">Across 142 attempts</p>
                      </div>
                    </div>
                    {/* Mini bar chart */}
                    <div className="flex items-end gap-2">
                      {[65, 80, 45, 90, 72, 85, 55].map((h, i) => (
                        <div key={i} className="flex-1">
                          <div className="rounded-sm bg-white/[0.03]" style={{ height: 60 }}>
                            <div
                              className="w-full rounded-sm bg-gradient-to-t from-purple-600/40 to-purple-400/20"
                              style={{ height: `${h}%`, marginTop: `${100 - h}%` }}
                            />
                          </div>
                          <p className="mt-1 text-center text-[9px] text-white/20">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                          </p>
                        </div>
                      ))}
                    </div>
                    {/* Streak */}
                    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5">
                      <Flame className="h-4 w-4 text-orange-400" />
                      <span className="text-sm font-semibold text-white">12</span>
                      <span className="text-xs text-white/45">day streak</span>
                      <Zap className="ml-auto h-3.5 w-3.5 text-yellow-400/50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-[1420px] px-9">
        <div className="flex items-center justify-center py-4">
          <div className="h-px flex-1 bg-white/[0.05]" />
          <div className="mx-4 h-1.5 w-1.5 rotate-45 rounded-sm bg-white/10" />
          <div className="h-px flex-1 bg-white/[0.05]" />
        </div>
      </div>

      {/* What we do — with large pitch illustration */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/20">
                What we do
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                A complete referee training platform
              </h2>
            </div>
          </ScrollAnimate>

          {/* Pitch illustration */}
          <ScrollAnimate delay={100}>
            <div className="mx-auto mt-12 max-w-3xl">
              <div className="glass-card overflow-hidden">
                <svg viewBox="0 0 800 300" className="w-full" fill="none">
                  {/* Pitch background */}
                  <rect width="800" height="300" fill="#0d1a0d"/>
                  {/* Field lines */}
                  <rect x="40" y="20" width="720" height="260" stroke="#1a3a1a" strokeWidth="2" rx="2"/>
                  <line x1="400" y1="20" x2="400" y2="280" stroke="#1a3a1a" strokeWidth="2"/>
                  <circle cx="400" cy="150" r="50" stroke="#1a3a1a" strokeWidth="2"/>
                  <circle cx="400" cy="150" r="3" fill="#1a3a1a"/>
                  {/* Penalty areas */}
                  <rect x="40" y="80" width="80" height="140" stroke="#1a3a1a" strokeWidth="2"/>
                  <rect x="680" y="80" width="80" height="140" stroke="#1a3a1a" strokeWidth="2"/>
                  {/* Goal areas */}
                  <rect x="40" y="110" width="30" height="80" stroke="#1a3a1a" strokeWidth="1.5"/>
                  <rect x="730" y="110" width="30" height="80" stroke="#1a3a1a" strokeWidth="1.5"/>
                  {/* Players — team 1 (blue) */}
                  <circle cx="200" cy="100" r="8" fill="#3b82f6" opacity="0.7"/>
                  <circle cx="220" cy="180" r="8" fill="#3b82f6" opacity="0.7"/>
                  <circle cx="300" cy="130" r="8" fill="#3b82f6" opacity="0.7"/>
                  <circle cx="350" cy="200" r="8" fill="#3b82f6" opacity="0.7"/>
                  <circle cx="500" cy="140" r="8" fill="#3b82f6" opacity="0.7"/>
                  {/* Players — team 2 (red) */}
                  <circle cx="450" cy="170" r="8" fill="#ef4444" opacity="0.7"/>
                  <circle cx="550" cy="120" r="8" fill="#ef4444" opacity="0.7"/>
                  <circle cx="600" cy="190" r="8" fill="#ef4444" opacity="0.7"/>
                  <circle cx="650" cy="150" r="8" fill="#ef4444" opacity="0.7"/>
                  {/* Referee */}
                  <circle cx="380" cy="160" r="6" fill="#fbbf24" opacity="0.8"/>
                  {/* Ball */}
                  <circle cx="460" cy="155" r="4" fill="white" opacity="0.9"/>
                  {/* Decision indicator */}
                  <circle cx="460" cy="155" r="20" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5"/>
                  {/* AI analysis box */}
                  <rect x="520" y="40" width="240" height="70" rx="8" fill="rgba(168,85,247,0.1)" stroke="rgba(168,85,247,0.2)" strokeWidth="1"/>
                  <text x="540" y="62" fill="rgba(168,85,247,0.7)" fontSize="10" fontWeight="600">ANALYSIS</text>
                  <text x="540" y="80" fill="rgba(255,255,255,0.5)" fontSize="11">Foul detected — excessive force</text>
                  <text x="540" y="96" fill="rgba(255,255,255,0.3)" fontSize="10">Law 12 → Direct FK + Red card</text>
                </svg>
              </div>
            </div>
          </ScrollAnimate>

          {/* Feature cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {features.map((f, i) => (
              <ScrollAnimate key={f.title} delay={i * 80}>
                <div className="feature-item">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10">
                    <f.icon className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/45">
                    {f.description}
                  </p>
                </div>
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-[1420px] px-9">
        <div className="flex items-center justify-center py-4">
          <div className="h-px flex-1 bg-white/[0.05]" />
          <div className="mx-4 h-1.5 w-1.5 rotate-45 rounded-sm bg-white/10" />
          <div className="h-px flex-1 bg-white/[0.05]" />
        </div>
      </div>

      {/* Values */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/20">
                Our values
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                What drives us
              </h2>
            </div>
          </ScrollAnimate>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {values.map((v, i) => (
              <ScrollAnimate key={v.title} delay={i * 80}>
                <div className="text-center">
                  <div className="relative mx-auto mb-4 w-fit">
                    <div className="absolute -inset-2 rounded-2xl bg-purple-500/10 blur-lg" />
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-400/10 ring-4 ring-purple-500/5">
                      <v.icon className="h-6 w-6 text-purple-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/45">
                    {v.description}
                  </p>
                </div>
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-[1420px] px-9">
        <div className="flex items-center justify-center py-4">
          <div className="h-px flex-1 bg-white/[0.05]" />
          <div className="mx-4 h-1.5 w-1.5 rotate-45 rounded-sm bg-white/10" />
          <div className="h-px flex-1 bg-white/[0.05]" />
        </div>
      </div>

      {/* Australian football — with map illustration */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="grid items-center gap-16 md:grid-cols-2">
              {/* Illustration — referee on pitch */}
              <div className="glass-card overflow-hidden p-1">
                <div className="rounded-xl bg-[#0a0a0f] p-6">
                  <div className="space-y-4">
                    {/* Stats mock */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <svg width="80" height="80" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                          <circle cx="40" cy="40" r="32" fill="none" stroke="url(#about-ring)" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 32 * 0.87} ${2 * Math.PI * 32 * 0.13}`} transform="rotate(-90 40 40)" />
                          <defs><linearGradient id="about-ring" x1="0%" y1="0%" x2="100%"><stop offset="0%" stopColor="#a855f7"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs>
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">87%</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Overall Accuracy</p>
                        <p className="text-xs text-white/45">Across 142 attempts</p>
                      </div>
                    </div>
                    {/* Mini bar chart */}
                    <div className="flex items-end gap-2">
                      {[65, 80, 45, 90, 72, 85, 55].map((h, i) => (
                        <div key={i} className="flex-1">
                          <div className="rounded-sm bg-white/[0.03]" style={{ height: 60 }}>
                            <div
                              className="w-full rounded-sm bg-gradient-to-t from-purple-600/40 to-purple-400/20"
                              style={{ height: `${h}%`, marginTop: `${100 - h}%` }}
                            />
                          </div>
                          <p className="mt-1 text-center text-[9px] text-white/20">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                          </p>
                        </div>
                      ))}
                    </div>
                    {/* Streak */}
                    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5">
                      <Flame className="h-4 w-4 text-orange-400" />
                      <span className="text-sm font-semibold text-white">12</span>
                      <span className="text-xs text-white/45">day streak</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text */}
              <div>
                <Sparkles className="mb-4 h-8 w-8 text-purple-400" />
                <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Built for Australian referees
                </h2>
                <p className="mt-4 leading-relaxed text-white/45">
                  RefZone is proudly built in Australia, with a deep commitment to
                  supporting the Australian referee community. From grassroots
                  weekend matches to state-level competitions, we understand the
                  unique challenges Australian referees face — limited access
                  to training resources, vast geographical distances, and small
                  referee panels.
                </p>
                <p className="mt-3 leading-relaxed text-white/45">
                  Our platform is designed to help every Australian
                  referee access the same quality of training, no matter where they
                  are based.
                </p>
              </div>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* CTA */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px] text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Join hundreds of referees already training smarter
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/45">
            Start improving your decision-making today with algorithm-driven scenarios,
            quizzes, and personalised analytics.
          </p>
          <div className="relative mt-8 inline-block">
            <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl" />
            <Link
              href="/auth/sign-up"
              className="relative inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
            >
              Get started for free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
