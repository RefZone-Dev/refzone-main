import type React from "react"
import { NavBar } from "@/components/nav-bar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <NavBar />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="container mx-auto md:p-8 p-4 md:pt-8 max-w-7xl pt-5 md:mt-0 mt-14">{children}</div>
      </main>
    </div>
  )
}
