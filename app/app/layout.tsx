import type React from "react"
import type { Metadata } from "next"
import { NavBar } from "@/components/nav-bar"

export const metadata: Metadata = {
  title: "RefZone",
  description: "Your referee training dashboard",
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <NavBar />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="container mx-auto md:p-8 p-4 pt-20 md:pt-8 max-w-7xl">{children}</div>
      </main>
    </div>
  )
}
