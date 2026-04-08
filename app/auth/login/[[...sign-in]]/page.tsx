"use client"

import { SignIn, useUser } from "@clerk/nextjs"
import Link from "next/link"

export default function LoginPage() {
  const { isSignedIn } = useUser()

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-[#0a0a0f]">
      <div className="w-full max-w-md flex flex-col items-center">
        {isSignedIn ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">R</span>
              <span className="text-white">efZone</span>
            </h1>
            <p className="text-white/45 mb-8">You&apos;re already signed in</p>
            <Link
              href="/dashboard"
              className="bg-white/85 text-black py-2.5 px-6 rounded-xl border border-white/20 hover:bg-white font-medium text-[15px] transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link href="/" className="mt-4 block text-sm text-white/45 hover:text-white transition-colors">
              Back to home
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">R</span>
                <span className="text-white">efZone</span>
                <span className="text-xs align-super text-white/30 ml-0.5">&#174;</span>
              </h1>
              <p className="text-white/45">Train like a pro referee</p>
            </div>
            <SignIn forceRedirectUrl="/dashboard" signUpUrl="/auth/sign-up" />
          </>
        )}
      </div>
    </div>
  )
}
