import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sitemap — RefZone',
  description:
    'Browse all pages on RefZone. Find features, training resources, company information, and account pages.',
}

const groups = [
  {
    heading: 'Platform',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Scenarios', href: '/features/scenarios' },
      { label: 'Quizzes', href: '/features/quizzes' },
      { label: 'Decision Lab', href: '/features/decision-lab' },
      { label: 'Analytics', href: '/features/analytics' },
{ label: 'Streaks', href: '/features/gamification' },
    ],
  },
  {
    heading: 'For Referees',
    links: [
      { label: 'Getting Started', href: '/referees/getting-started' },
      { label: 'Laws of the Game', href: '/referees/laws-of-the-game' },
      { label: 'Career Development', href: '/referees/career-development' },
      { label: 'Community', href: '/referees/community' },
      { label: 'Training Resources', href: '/referees/training-resources' },
      { label: 'Match Preparation', href: '/referees/match-preparation' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'Login', href: '/auth/sign-in' },
      { label: 'Sign Up', href: '/auth/sign-up' },
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Settings', href: '/settings' },
    ],
  },
]

export default function SitemapPage() {
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
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Sitemap
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/45">
            A complete index of all pages on RefZone.
          </p>
        </div>
      </section>

      {/* Sitemap links */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {groups.map((group) => (
              <div key={group.heading}>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/20">
                  {group.heading}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-purple-400 transition hover:text-purple-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
