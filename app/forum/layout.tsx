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
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Main Content - No navbar or footer for embedding */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">{children}</main>
    </div>
  )
}
