"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import {
  LayoutDashboard,
  Settings,
  User,
  LogOut,
  Shield,
  Moon,
  Sun,
  MessageSquare,
  Users,
  UserCircle,
  HelpCircle,
  Mail,
  Copy,
  Check,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function NavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userLoading, setUserLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    const supabase = createClient()

    // Use getSession for fast initial check (avoids network call)
    // then getUser for verified auth in background
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        setUserLoading(false)
        // Fetch admin status - handle case where column doesn't exist
        supabase.from("profiles").select("*").eq("id", session.user.id).single().then(({ data: profile, error }) => {
          if (!error && profile?.is_admin) setIsAdmin(true)
        }).catch(() => {
          // Silently fail if profiles table or is_admin column doesn't exist
        })
      } else {
        setUserLoading(false)
      }
    })
  }, [])

  const handleSignOut = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const [supportOpen, setSupportOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("admin@refzone.com.au")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const SupportDialog = ({ children }: { children: React.ReactNode }) => (
    <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Support</DialogTitle>
          <DialogDescription>Have a question or need help? Reach out to us via email.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <span className="flex-1 text-sm font-medium">admin@refzone.com.au</span>
            <Button variant="outline" size="sm" onClick={handleCopyEmail} className="gap-2 cursor-pointer bg-transparent">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <a
            href="mailto:admin@refzone.com.au"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium transition-colors hover:bg-primary/90"
          >
            <Mail className="h-4 w-4" />
            Send Email
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )

  const mainNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/decision-lab", label: "Decision Lab", icon: Users },
  ]

  const socialNavItems: { href: string; label: string; icon: any; tutorialId?: string }[] = []

  const bottomNavItems = [
    { href: "/settings", label: "Settings", icon: Settings, tutorialId: "settings-link" },
  ]

  if (isAdmin) {
    bottomNavItems.push({ href: "/admin", label: "Admin Panel", icon: Shield })
  }

  const NavLink = ({ item }: { item: { href: string; label: string; icon: any; tutorialId?: string } }) => {
    const Icon = item.icon
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
    return (
      <Link
        href={item.href}
        data-tutorial={item.tutorialId}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors cursor-pointer",
          isActive
            ? "bg-primary text-primary-foreground font-medium"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{item.label}</span>
      </Link>
    )
  }

  const NavLinks = ({ showSections = true }: { showSections?: boolean }) => (
    <>
      {mainNavItems.map((item) => (
        <NavLink key={item.href} item={item} />
      ))}

      {showSections && (
        <div className="my-3 border-t pt-3">
          <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Social</p>
          {socialNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>
      )}
      {!showSections && socialNavItems.map((item) => <NavLink key={item.href} item={item} />)}
    </>
  )

  const BottomNavLinks = () => (
    <>
      {bottomNavItems.map((item) => (
        <NavLink key={item.href} item={item} />
      ))}
    </>
  )

  // This prevents the old hamburger menu from flashing
  if (userLoading) {
    return (
      <>
        {/* Desktop Navigation - show skeleton */}
        <nav className="hidden md:flex h-screen w-64 flex-col border-r bg-background">
          <div className="p-6 border-b">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#9114af] to-[#ff5eb8]">
                <span className="text-xl font-bold text-white">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  <span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">R</span>
                  <span className="text-foreground">efZone</span>
                </h1>
                <p className="text-xs text-muted-foreground">Train Your Skills</p>
              </div>
            </div>
          </div>
          <div className="flex-1" />
        </nav>
        {/* Mobile - just show centered logo, no hamburger */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b h-14">
          <div className="flex items-center justify-center h-full">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-xl font-bold">
                <span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">R</span>
              <span className="text-foreground">efZone</span>
              </span>
            </Link>
          </div>
        </div>
      </>
    )
  }

  if (user) {
    return (
      <>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex h-screen w-64 flex-col border-r bg-background">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between gap-2">
              <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                <div>
                  <h1 className="text-xl font-bold">
                  <span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">R</span>
                  <span className="text-foreground">efZone</span>
                </h1>
                  <p className="text-xs text-muted-foreground">Train Your Skills</p>
                </div>
              </Link>
              <NotificationsDropdown />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              <NavLinks />
            </div>
          </div>
          <div className="border-t p-4 space-y-1">
            <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</p>
            <BottomNavLinks />
            <div className="pt-3 mt-3 border-t space-y-2">
              <SupportDialog>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 cursor-pointer"
                >
                  <HelpCircle className="h-5 w-5" />
                  Support
                </Button>
              </SupportDialog>
              {mounted && (
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 cursor-pointer"
                  onClick={toggleTheme}
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </Button>
              )}
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 cursor-pointer"
                onClick={handleSignOut}
                disabled={isLoading}
              >
                <LogOut className="h-5 w-5" />
                {isLoading ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile Bottom Navigation - includes MobileTopBar */}
        <MobileBottomNav />

        {/* Padding for bottom nav */}
        <style>{`
          @media (max-width: 768px) {
            main {
              padding-bottom: 80px;
            }
          }
        `}</style>
      </>
    )
  }

  // Mobile users who aren't logged in will see just the centered logo
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex h-screen w-64 flex-col border-r bg-background">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#9114af] to-[#ff5eb8]">
                <span className="text-xl font-bold text-white">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  <span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">R</span>
                  <span className="text-foreground">efZone</span>
                </h1>
                <p className="text-xs text-muted-foreground">Train Your Skills</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            <NavLinks />
          </div>
        </div>
        <div className="border-t p-4 space-y-1">
          <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</p>
          <BottomNavLinks />
          <div className="pt-3 mt-3 border-t space-y-2">
            {mounted && (
              <Button
                variant="outline"
                className="w-full justify-start gap-3 cursor-pointer bg-transparent"
                onClick={toggleTheme}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile - just show centered logo with theme toggle, no hamburger menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b h-14">
        <div className="flex items-center justify-center h-full px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">
              <span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">R</span>
              <span className="text-foreground">efZone</span>
            </span>
          </Link>
          {mounted && (
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="cursor-pointer absolute right-4">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
