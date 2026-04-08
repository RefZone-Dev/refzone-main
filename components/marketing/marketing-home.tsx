import Link from 'next/link'
import { Star, ArrowRight, Check } from 'lucide-react'
import { landingPage, faqPage } from '@/content/marketing'
import { ScrollAnimate } from '@/components/marketing/scroll-animate'
import { HeroSectionWrapper } from '@/components/marketing/hero-section'
import { FaqAccordion } from '@/components/marketing/faq-accordion'
import { HeroDemo } from '@/components/marketing/hero-demo'
import { ScenarioDemo } from '@/components/marketing/scenario-demo'
import { StatsCounter } from '@/components/marketing/stats-counter'
import { HeroCta, BottomCta } from '@/components/marketing/auth-cta'

/* ================================================================
   MARKETING HOME PAGE — Server Component
   Dark premium aesthetic matching navbar style
   ================================================================ */

const featureGrid = [
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-purple-400">
        <circle cx="16" cy="16" r="12" />
        <circle cx="16" cy="16" r="7" />
        <circle cx="16" cy="16" r="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="16" y1="26" x2="16" y2="30" />
        <line x1="2" y1="16" x2="6" y2="16" />
        <line x1="26" y1="16" x2="30" y2="16" />
      </svg>
    ),
    title: 'Scenarios',
    description: '100+ match-realistic situations with instant expert feedback on every call.',
    href: '/features/scenarios',
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-purple-400">
        <path d="M6 28V4a2 2 0 0 1 2-2h16v24H8a2 2 0 0 0 0 4h16" />
        <line x1="12" y1="10" x2="22" y2="10" />
        <line x1="12" y1="16" x2="20" y2="16" />
      </svg>
    ),
    title: 'Quizzes',
    description: '500+ questions spanning every Law of the Game, from offside to misconduct.',
    href: '/features/quizzes',
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-purple-400">
        <path d="M16 4a10 10 0 0 0-10 10c0 4 2.5 7.5 6 9v3h8v-3c3.5-1.5 6-5 6-9a10 10 0 0 0-10-10z" />
        <path d="M12 18c0-2 1-3 2.5-4s2.5-2 2.5-3.5a3 3 0 0 0-6 0" />
        <circle cx="16" cy="20" r="0.5" fill="currentColor" />
      </svg>
    ),
    title: 'Decision Lab',
    description: 'Interactive analysis tool that breaks down complex decisions in real time.',
    href: '/features/decision-lab',
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-purple-400">
        <rect x="4" y="18" width="5" height="10" rx="1" />
        <rect x="13.5" y="10" width="5" height="18" rx="1" />
        <rect x="23" y="4" width="5" height="24" rx="1" />
      </svg>
    ),
    title: 'Analytics',
    description: 'Accuracy metrics, law-specific tracking, and 7-day activity charts.',
    href: '/features/analytics',
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-purple-400">
        <path d="M18 2L6 18h10l-2 12 14-20H18l2-8z" />
      </svg>
    ),
    title: 'Streaks',
    description: 'Build daily training habits and track your consistency over time.',
    href: '/features/gamification',
  },
]

export function MarketingHomePage() {
  const { hero, section1, stats, testimonials, bottomCta } = landingPage

  return (
    <>
      {/* ============================================================
          1. HERO
          ============================================================ */}
      <HeroSectionWrapper>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
            {hero.headline.split('\n').map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/45 md:text-xl">
            {hero.subheadline}
          </p>

          <HeroCta
            signedOutLabel={hero.primaryCta.label}
            signedOutHref={hero.primaryCta.href}
            secondaryLabel={hero.secondaryCta?.label || ""}
            secondaryHref={hero.secondaryCta?.href || ""}
          />

          {/* Glass-framed product demo */}
          <div className="mt-16 mx-auto max-w-4xl">
            <div className="glass-card p-1">
              <div className="rounded-xl bg-[#0a0a0f] overflow-hidden">
                <HeroDemo />
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-12">
            <p className="text-xs text-white/30 text-center mb-3">Trusted by referees from</p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
              {hero.logoStrip.map((name) => (
                <span key={name} className="text-[13px] text-white/20">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </HeroSectionWrapper>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      {/* ============================================================
          2. FEATURE SHOWCASE — "Real decisions. Real improvement."
          ============================================================ */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1200px]">
          <ScrollAnimate>
            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                {section1.headline}
              </h2>
              <p className="text-[16px] text-white/45 text-center max-w-xl mx-auto mt-4">
                {section1.mainFeature.description.slice(0, 120)}...
              </p>
            </div>
          </ScrollAnimate>

          {/* Large glass-framed scenario mockup — VIDEO-based */}
          <div className="mt-16 mx-auto max-w-4xl">
            <div className="glass-card p-6 md:p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20">
                    <svg className="h-3.5 w-3.5 text-purple-400" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider text-white/20">
                    Video Scenario — Law 12
                  </span>
                </div>

                {/* Video placeholder — represents the actual video player */}
                <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="aspect-video flex items-center justify-center">
                    {/* Mock pitch graphic */}
                    <svg viewBox="0 0 640 360" className="h-full w-full" fill="none">
                      <rect width="640" height="360" fill="#0d1a0d"/>
                      {/* Pitch lines */}
                      <rect x="40" y="20" width="560" height="320" stroke="#1a3a1a" strokeWidth="2" fill="none" rx="2"/>
                      <line x1="320" y1="20" x2="320" y2="340" stroke="#1a3a1a" strokeWidth="2"/>
                      <circle cx="320" cy="180" r="60" stroke="#1a3a1a" strokeWidth="2" fill="none"/>
                      <circle cx="320" cy="180" r="3" fill="#1a3a1a"/>
                      {/* Penalty areas */}
                      <rect x="40" y="100" width="100" height="160" stroke="#1a3a1a" strokeWidth="2" fill="none"/>
                      <rect x="500" y="100" width="100" height="160" stroke="#1a3a1a" strokeWidth="2" fill="none"/>
                      {/* Player dots */}
                      <circle cx="480" cy="170" r="8" fill="#ef4444" opacity="0.8"/>
                      <circle cx="500" cy="190" r="8" fill="#3b82f6" opacity="0.8"/>
                      <circle cx="510" cy="160" r="6" fill="#fbbf24" opacity="0.6"/>
                    </svg>
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                        <svg className="ml-1 h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                    {/* Duration badge */}
                    <div className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-0.5 text-xs text-white/70">
                      0:12
                    </div>
                  </div>
                </div>

                <p className="text-[15px] leading-relaxed text-white/45">
                  Watch the video above and decide: What is the correct decision for this challenge?
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    'No foul — ball was played first',
                    'Direct free kick + yellow card',
                    'Direct free kick + red card',
                    'Penalty kick + red card',
                  ].map((option, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border px-4 py-3 text-sm transition-colors ${
                        i === 2
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : 'border-white/10 bg-white/[0.03] text-white/45'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-medium ${
                            i === 2
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-white/[0.06] text-white/20'
                          }`}
                        >
                          {i === 2 ? <Check className="h-3 w-3" /> : String.fromCharCode(65 + i)}
                        </div>
                        <span>{option}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI feedback */}
                <div className="rounded-lg border border-emerald-500/10 bg-emerald-500/[0.04] px-4 py-3">
                  <p className="text-xs leading-relaxed text-emerald-400/80">
                    <strong>Analysis:</strong> The challenge from behind with excessive force warrants a direct free kick and red card under Law 12, regardless of whether the ball was won.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {['Video-based scenarios', 'Algorithm-driven analysis', 'Categorised by law'].map((pill) => (
              <span
                key={pill}
                className="border border-white/10 text-white/45 rounded-full px-4 py-1.5 text-[13px]"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          3. INTERACTIVE DEMO — "Test your knowledge"
          ============================================================ */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1200px]">
          <ScrollAnimate>
            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                Test your knowledge
              </h2>
              <p className="text-[16px] text-white/45 text-center max-w-xl mx-auto mt-4">
                Try a quick quiz from our library of 500+ questions covering every Law of the Game.
              </p>
            </div>
          </ScrollAnimate>

          <div className="mt-16 mx-auto max-w-2xl">
            <div className="glass-card p-1">
              <div className="rounded-xl bg-[#0a0a0f] overflow-hidden">
                <ScenarioDemo />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          4. FEATURE GRID — "Everything you need"
          ============================================================ */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1200px]">
          <ScrollAnimate>
            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                Everything you need
              </h2>
              <p className="text-[16px] text-white/45 text-center max-w-xl mx-auto mt-4">
                A complete training platform built for referees at every level.
              </p>
            </div>
          </ScrollAnimate>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featureGrid.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="feature-item group transition-colors hover:border-white/20 hover:bg-white/[0.07]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-white font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-white/45 text-[14px] leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-white/45 transition-colors group-hover:text-white">
                  Learn more
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          5. STATS — "Numbers that speak"
          ============================================================ */}
      <section className="relative px-9 py-24 md:py-32">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-purple-600/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-[1200px]">
          <ScrollAnimate>
            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                {stats.headline.replace('\n', ' ')}
              </h2>
              <p className="text-[16px] text-white/45 text-center max-w-xl mx-auto mt-4">
                {stats.subheadline}
              </p>
            </div>
          </ScrollAnimate>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {stats.items.map((stat) => (
              <div
                key={stat.label}
                className="glass-card p-8 text-center"
              >
                <StatsCounter value={stat.value} label={stat.label} />
              </div>
            ))}
          </div>

          {/* Tag pills */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            {stats.tags.map((tag) => (
              <span
                key={tag}
                className="border border-white/10 text-white/45 rounded-full px-4 py-1.5 text-[13px]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          6. TESTIMONIALS
          ============================================================ */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1200px]">
          <ScrollAnimate>
            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                {testimonials.headline}
              </h2>
            </div>
          </ScrollAnimate>

          {/* Featured testimonial */}
          <div className="mt-16 mx-auto max-w-3xl">
            <div className="relative glass-card p-8 md:p-12">
              <svg className="absolute -top-2 -left-2 w-12 h-12 text-purple-500/10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
              </svg>
              <blockquote className="text-white/80 text-lg leading-relaxed md:text-xl">
                &ldquo;{testimonials.featured.quote}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-sm font-medium text-white/45">
                  {testimonials.featured.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{testimonials.featured.author}</p>
                  <p className="text-white/45 text-[13px]">{testimonials.featured.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Marquee row 1 */}
          <div className="mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex animate-marquee gap-4">
              {[...testimonials.items, ...testimonials.items].map((t, i) => (
                <div
                  key={i}
                  className="w-[340px] shrink-0 glass-card p-6"
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mt-3 text-white/80 text-[14px] leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-4">
                    <p className="text-xs font-medium text-white">{t.author}</p>
                    <p className="text-white/45 text-[13px]">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marquee row 2 — reversed */}
          <div className="mt-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex animate-marquee-reverse gap-4">
              {[...testimonials.items.slice().reverse(), ...testimonials.items.slice().reverse()].map(
                (t, i) => (
                  <div
                    key={i}
                    className="w-[340px] shrink-0 glass-card p-6"
                  >
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.stars }).map((_, s) => (
                        <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="mt-3 text-white/80 text-[14px] leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="mt-4">
                      <p className="text-xs font-medium text-white">{t.author}</p>
                      <p className="text-white/45 text-[13px]">{t.role}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          7. FAQ
          ============================================================ */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-2xl">
          <ScrollAnimate>
            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                {faqPage.headline}
              </h2>
              <p className="text-[16px] text-white/45 text-center max-w-xl mx-auto mt-4">
                Everything you need to know about RefZone.
              </p>
            </div>
          </ScrollAnimate>

          <div className="mt-12">
            <FaqAccordion items={faqPage.items} />
          </div>
        </div>
      </section>

      {/* ============================================================
          8. BOTTOM CTA
          ============================================================ */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1200px] text-center">
          <ScrollAnimate>
            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              {bottomCta.headline}
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-[16px] text-white/45">
              Join hundreds of Australian referees training smarter with algorithm-driven scenarios,
              quizzes, and analytics.
            </p>
            <BottomCta />
          </ScrollAnimate>
        </div>
      </section>
    </>
  )
}
