"use client"

import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { ArrowRight } from "lucide-react"

export function HeroCta({
  signedOutLabel,
  signedOutHref,
  secondaryLabel,
  secondaryHref,
}: {
  signedOutLabel: string
  signedOutHref: string
  secondaryLabel: string
  secondaryHref: string
}) {
  const { isSignedIn } = useUser()

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      {isSignedIn ? (
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
        >
          Go to Dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <>
          <Link
            href={signedOutHref}
            className="inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
          >
            {signedOutLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          {secondaryLabel && (
            <Link
              href={secondaryHref}
              className="inline-flex items-center gap-2 text-white/45 hover:text-white py-2.5 px-5 rounded-xl font-medium text-[15px] transition-colors"
            >
              {secondaryLabel}
            </Link>
          )}
        </>
      )}
    </div>
  )
}

export function BottomCta() {
  const { isSignedIn } = useUser()

  return (
    <div className="mt-10 relative inline-block">
      <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl" />
      <Link
        href={isSignedIn ? "/dashboard" : "/auth/sign-up"}
        className="relative inline-flex items-center gap-2 bg-white/85 text-black py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
      >
        {isSignedIn ? "Go to Dashboard" : "Start training free"}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
