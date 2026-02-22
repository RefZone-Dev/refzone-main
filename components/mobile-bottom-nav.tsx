"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Home, Settings, LogOut, Moon, Sun, Users, Shield, HelpCircle, Mail, Copy, Check, FlaskConical } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { MobileTopBar } from "@/components/mobile-top-bar"
import { useTutorial } from "@/components/tutorial/tutorial-context"

export function MobileBottomNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const { openDropdown, setOpenDropdown, isActive: tutorialActive } = useTutorial()
  const [socialOpen, setSocialOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("admin@refzone.com.au")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    if (openDropdown === "social-dropdown") {
      setSocialOpen(true)
      setAccountOpen(false)
    } else if (openDropdown === "account-dropdown") {
      setAccountOpen(true)
      setSocialOpen(false)
    } else if (!tutorialActive) {
      // Don't auto-close if not in tutorial
    }
  }, [openDropdown, tutorialActive])

  useEffect(() => {
    setMounted(true)
    const checkAdmin = async () => {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", session.user.id).single()
          if (profile?.is_admin) {
            setIsAdmin(true)
          }
        }
      } catch (error) {
        // Silently handle errors
      }
    }
    checkAdmin()
  }, [])

  const handleSignOut = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const isActive = (href: string) => pathname === href
  const isDecisionLabActive = pathname === "/decision-lab"
  const isAccountActive = ["/settings", "/admin"].includes(pathname)

  const GradientUnderline = ({ active }: { active: boolean }) => (
    <span
      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-[#9114af] to-[#ff5eb8] rounded-full transition-all duration-300 my-2 ${
        active ? "w-8 opacity-100" : "w-0 opacity-0 group-hover:w-8 group-hover:opacity-100"
      }`}
    />
  )

  return (
    <>
      {/* Mobile Top Bar with centered logo */}
      <MobileTopBar />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50 bg-background border-t">
        <div className="flex items-center justify-between px-2 py-2 h-16 max-w-md mx-auto w-full">
          {/* Notifications - smaller, no caption */}
          <div className="flex items-center justify-center w-12">
            <NotificationsDropdown />
          </div>

          {/* DecisionLab - larger with caption */}
          <Link
            href="/decision-lab"
            data-tutorial="decision-lab-nav"
            className="group relative flex flex-col items-center justify-center gap-0.5 p-2 pb-3 rounded-xl cursor-pointer"
          >
            <FlaskConical className="h-6 w-6" />
            <span className="text-[10px] text-muted-foreground">DecisionLab</span>
            <GradientUnderline active={isDecisionLabActive} />
          </Link>

          {/* Home - larger with caption */}
          <Link
            href="/dashboard"
            className="group relative flex flex-col items-center justify-center gap-0.5 p-2 pb-3 rounded-xl cursor-pointer"
          >
            <Home className="h-6 w-6" />
            <span className="text-[10px] text-muted-foreground">Home</span>
            <GradientUnderline active={isActive("/dashboard")} />
          </Link>

          {/* Account dropdown - larger with caption */}
          <DropdownMenu open={accountOpen} onOpenChange={setAccountOpen}>
            <DropdownMenuTrigger asChild>
              <button
                data-tutorial="settings-nav"
                className="group relative flex flex-col items-center justify-center gap-0.5 p-2 pb-3 rounded-xl cursor-pointer"
              >
                <Settings className="h-6 w-6" />
                <span className="text-[10px] text-muted-foreground">Settings</span>
                <GradientUnderline active={isAccountActive} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setAccountOpen(false)
                  setSupportOpen(true)
                }}
                className="flex items-center cursor-pointer"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Support
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer"
                  onClick={handleSignOut}
                  disabled={isLoading}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoading ? "Signing out..." : "Sign Out"}
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle - smaller, no caption */}
          <div className="flex items-center justify-center w-12">
            {mounted && (
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="cursor-pointer h-10 w-10">
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Support Dialog */}
      <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
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
    </>
  )
}
