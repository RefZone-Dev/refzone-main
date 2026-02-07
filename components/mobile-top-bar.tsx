"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { RefZoneLogo } from "@/components/refzone-logo"

interface MobileTopBarProps {
  showBackButton?: boolean
  backHref?: string
  backLabel?: string
}

export function MobileTopBar({
  showBackButton = false,
  backHref = "/dashboard",
  backLabel = "Back",
}: MobileTopBarProps) {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b h-14">
      <div className="flex items-center justify-center h-full px-4 relative">
        {/* Back button on left */}
        {showBackButton && (
          <Link
            href={backHref}
            className="absolute left-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">{backLabel}</span>
          </Link>
        )}

        {/* Centered logo */}
        <RefZoneLogo href="/dashboard" size="md" />
      </div>
    </div>
  )
}
