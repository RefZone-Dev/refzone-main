import type React from "react"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { NavBar } from "@/components/nav-bar"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Forum - RefZone",
  description: "Connect with fellow referees, ask questions, and share knowledge",
}

export default async function CommunityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return (
      <div className="flex h-screen overflow-hidden">
        <NavBar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto md:p-8 p-4 pt-20 md:pt-8 max-w-7xl">{children}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      {/* Public Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">
              <span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">R</span>
              <span className="text-gray-900 dark:text-white">efZone</span>
            </span>
            <span className="text-[10px] align-super text-gray-500 ml-0.5">&#174;</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/forum"
              className="text-sm font-medium text-purple-700 dark:text-purple-400"
            >
              Forum
            </Link>
            <Link
              href="/auth/login"
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/auth/sign-up"
              className="text-sm font-medium bg-gradient-to-r from-[#9114af] to-[#ff5eb8] hover:from-[#7a0f94] hover:to-[#e54da3] text-white rounded-full px-5 py-2 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">{children}</main>

      {/* Footer */}
      <footer className="border-t border-purple-100 dark:border-purple-900/30 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">
                <span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">R</span>
                <span className="text-gray-900 dark:text-white">efZone</span>
              </span>
              <span className="text-[10px] align-super text-gray-500 ml-0.5">&#174;</span>
            </Link>
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/terms" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Privacy</Link>
              <Link href="/forum" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Forum</Link>
              <a href="mailto:admin@refzone.org" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Contact</a>
              <Link href="/auth/login" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Log in</Link>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-500">
              &copy; 2026 RefZone. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
