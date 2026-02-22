"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  PlayCircle,
  FileQuestion,
  FileText,
  FlaskConical,
  Settings,
  User,
  Trophy,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/scenarios", icon: PlayCircle, label: "Scenarios", tutorialId: "scenarios-nav" },
  { href: "/quizzes", icon: FileQuestion, label: "Quizzes", tutorialId: "quizzes-nav" },
  { href: "/decision-lab", icon: FlaskConical, label: "DecisionLab", tutorialId: "decision-lab-nav" },
]

const socialItems = [
  { href: "/profile", icon: User, label: "Your Page" },
  { href: "/leaderboard", icon: Trophy, label: "Leaderboard", tutorialId: "leaderboard-link" },
]

const accountItems = [
  { href: "/settings", icon: Settings, label: "Settings" },
  { href: "/account", icon: User, label: "Account", tutorialId: "account-link" },
]

export function SideNav() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#9114af] to-[#ff5eb8]">
            <span className="text-lg font-bold text-white">R</span>
          </div>
          <span className="text-xl font-bold">
            <span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">R</span>
            <span className="text-foreground">efZone</span>
          </span>
        </Link>
      </div>
      <nav className="space-y-6 p-4">
        {/* Main nav items */}
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                data-tutorial={item.tutorialId}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Social section */}
        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground" data-tutorial="social-nav">
            Social
          </p>
          <div className="space-y-1">
            {socialItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-tutorial={item.tutorialId}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Account section */}
        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">Account</p>
          <div className="space-y-1">
            {accountItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-tutorial={item.tutorialId}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </aside>
  )
}
