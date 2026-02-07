import type React from "react"
import { NavBar } from "@/components/nav-bar"

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <NavBar />
      <main className="flex-1 md:ml-0 mt-16 md:mt-0 overflow-auto">{children}</main>
    </div>
  )
}
