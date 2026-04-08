import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, Clock, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact — RefZone',
  description:
    'Get in touch with the RefZone team. Questions about referee training, association partnerships, or platform support — we are here to help.',
}

const cards = [
  {
    icon: Mail,
    title: 'Email us',
    description: 'For general enquiries, feedback, or support requests.',
    detail: 'admin@refzone.com.au',
    href: 'mailto:admin@refzone.com.au',
  },
  {
    icon: Clock,
    title: 'Support',
    description: 'We typically respond within 24 hours on business days.',
    detail: 'Mon — Fri, 9am — 5pm AEST',
  },
  {
    icon: Users,
    title: 'Associations',
    description:
      'Want RefZone for your referee panel? Let\u2019s talk about partnership opportunities.',
    detail: 'admin@refzone.com.au',
    href: 'mailto:admin@refzone.com.au?subject=Association%20Partnership',
  },
]

export default function ContactPage() {
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
            Get in touch
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/45">
            Have a question, suggestion, or want to bring RefZone to your
            association? We&apos;d love to hear from you.
          </p>
          <div className="mt-8 flex items-center justify-center gap-1.5">
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
            <div className="h-0.5 w-12 rounded-full bg-white/20" />
            <div className="h-0.5 w-8 rounded-full bg-white/20" />
          </div>
        </div>
      </section>

      {/* Decorative gradient line */}
      <div className="h-px bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />

      {/* Contact cards */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-[1420px]">
          <div className="grid gap-6 md:grid-cols-3">
            {cards.map((c) => (
              <div
                key={c.title}
                className="overflow-hidden rounded-xl border border-white/10"
              >
                <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                <div className="bg-white/[0.05] p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10">
                    <c.icon className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{c.title}</h3>
                  <p className="mt-1 text-sm text-white/45">
                    {c.description}
                  </p>
                  {c.href ? (
                    <a
                      href={c.href}
                      className="mt-3 inline-block text-sm font-medium text-purple-400 hover:text-purple-300"
                    >
                      {c.detail}
                    </a>
                  ) : (
                    <p className="mt-3 text-sm font-medium text-white">
                      {c.detail}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* FAQ link */}
          <div className="mt-10 glass-card rounded-2xl border border-white/10 bg-white/[0.05] p-6 text-center">
            <h3 className="text-lg font-semibold text-white">
              Check our FAQ first
            </h3>
            <p className="mt-1 text-sm text-white/45">
              Many common questions are already answered in our FAQ section.
            </p>
            <Link
              href="/#faq"
              className="mt-3 inline-block text-sm font-medium text-purple-400 hover:text-purple-300"
            >
              View frequently asked questions
            </Link>
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

      {/* Contact form */}
      <section className="px-9 py-24 md:py-32">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-bold text-white">
            Send us a message
          </h2>
          <p className="mt-2 text-center text-sm text-white/45">
            Fill in the form below and we&apos;ll get back to you as soon as possible.
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <iframe
              src="https://nodumforms.com/f/lrl2owrx/send-us-a-message"
              width="100%"
              height="650"
              frameBorder="0"
              title="Contact form"
              style={{ border: 'none', background: 'transparent' }}
              allow="clipboard-write"
            />
          </div>
        </div>
      </section>
    </main>
  )
}
