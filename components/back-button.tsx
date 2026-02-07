"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface BackButtonProps {
  href: string
  label?: string
  className?: string
}

export function BackButton({ href, label = "Back", className }: BackButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  )
}
