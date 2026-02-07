import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { NavBar } from "@/components/nav-bar"

export default async function UserProfileLayout({
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
          <div className="container mx-auto md:p-8 p-4 pt-20 md:pt-8 max-w-5xl">{children}</div>
        </main>
      </div>
    )
  }

  // Non-logged-in users - simple layout
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">{children}</main>
  )
}
