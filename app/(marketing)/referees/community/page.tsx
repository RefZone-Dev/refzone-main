import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollAnimate } from '@/components/marketing/scroll-animate'
import { Users, ArrowRight, MessageSquare, UserPlus, Share2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Community — RefZone',
  description:
    'Join Australia\'s growing referee community on RefZone. Discuss decisions in the forum, share knowledge, and connect with referees at every level.',
}

const mockPosts = [
  { author: 'WhistleKing', time: '2h ago', title: 'Law 12 — reckless vs serious foul play?', replies: 14, tag: 'Discussion' },
  { author: 'SydneyRef', time: '5h ago', title: 'How do you handle dissent from captains?', replies: 9, tag: 'Advice' },
  { author: 'GrassrootsGuru', time: '1d ago', title: 'Best warm-up routine before a match?', replies: 22, tag: 'Fitness' },
  { author: 'LawNerd42', time: '1d ago', title: 'New IFAB changes for 2026/27 — thoughts?', replies: 31, tag: 'News' },
]

export default function CommunityPage() {
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
            <Users className="h-8 w-8 text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Connect with referees across Australia
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-white/45">
            Refereeing can be isolating. RefZone brings officials together to
            share knowledge, compete, and support each other.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-xs font-medium text-white/45">256 active referees</span>
          </div>
          <div className="mt-6 flex items-center justify-center gap-1.5">
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
            <div className="h-0.5 w-12 rounded-full bg-white/20" />
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
          </div>
        </div>
      </section>

      {/* Forum */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <ScrollAnimate>
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-pink-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/20">Community feature</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Forum</h2>
                <p className="mt-3 text-[14px] leading-relaxed text-white/45">
                  Debate controversial decisions, ask for advice on tricky situations,
                  and share your match experiences with referees who understand. Our
                  moderated forum keeps conversation constructive and on-topic.
                </p>
              </div>
              <div className="glass-card rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/20">Recent posts</span>
                  <div className="flex -space-x-2">
                    {[
                      { initials: 'WK', bg: 'bg-violet-500' },
                      { initials: 'SR', bg: 'bg-sky-500' },
                      { initials: 'GG', bg: 'bg-emerald-500' },
                      { initials: 'LN', bg: 'bg-amber-500' },
                      { initials: '+8', bg: 'bg-purple-500/60' },
                    ].map((avatar) => (
                      <div key={avatar.initials} className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#0a0a0f] text-[9px] font-bold text-white ${avatar.bg}`}>
                        {avatar.initials}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  {mockPosts.map((post) => (
                    <div key={post.title} className="rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3">
                      <div className="flex items-center gap-2 text-xs text-white/20">
                        <span className="font-medium text-pink-400">{post.author}</span>
                        <span>·</span>
                        <span>{post.time}</span>
                        <span className="ml-auto rounded-full bg-purple-400/10 px-2 py-0.5 text-[10px] font-semibold text-purple-400">{post.tag}</span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-white">{post.title}</p>
                      <span className="mt-1 block text-xs text-white/20">{post.replies} replies</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollAnimate>
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

      {/* Friends + Share knowledge */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px] grid gap-6 sm:grid-cols-2">
          <ScrollAnimate>
            <div className="feature-item rounded-xl border border-white/10 bg-white/[0.05] p-6">
              <UserPlus className="mb-4 h-8 w-8 text-pink-400" />
              <h3 className="mb-2 text-lg font-bold text-white">Friends</h3>
              <p className="text-sm leading-relaxed text-white/45">
                Add friends, compare stats side by side, and cheer each other on.
                The friend system makes training social — challenge a mate to a
                quiz duel or see who can hold the longest streak.
              </p>
            </div>
          </ScrollAnimate>
          <ScrollAnimate delay={80}>
            <div className="feature-item rounded-xl border border-white/10 bg-white/[0.05] p-6">
              <Share2 className="mb-4 h-8 w-8 text-pink-400" />
              <h3 className="mb-2 text-lg font-bold text-white">Share knowledge</h3>
              <p className="text-sm leading-relaxed text-white/45">
                Experienced referees can share insights through forum answers and
                scenario discussions. Collaborative learning means the whole
                community improves together.
              </p>
            </div>
          </ScrollAnimate>
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
            You are not in this alone
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/45">
            Join a growing community of referees who support each other and
            improve together.
          </p>
          <Link
            href="/auth/sign-up"
            className="mt-6 inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
          >
            Join the community
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
