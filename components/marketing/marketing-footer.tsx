import Link from 'next/link'
import { footerContent, siteConfig } from '@/content/marketing'

export function MarketingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto max-w-[1420px] px-9 py-16">
        <div className="grid gap-10 md:grid-cols-5">
          {/* Brand column */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center">
              <span className="text-[18px] font-semibold leading-none">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  R
                </span>
                <span className="text-white">efZone</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-white/45">
              {siteConfig.description}
            </p>
            {footerContent.social?.length > 0 && (
              <div className="mt-5 flex items-center gap-3">
                {footerContent.social.map((s: { href: string; label: string }) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] text-white/45 transition-colors hover:text-white"
                    aria-label={s.label}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          {footerContent.columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-white/20">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-white/45 transition-colors hover:text-white"
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

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1420px] px-9 mt-12 pt-8 pb-8">
          <p className="text-[13px] text-white/20">
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
