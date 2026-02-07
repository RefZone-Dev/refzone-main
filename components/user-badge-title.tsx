"use client"

import { useCustomization } from "@/lib/customization-context"
import { Star } from "lucide-react"

type UserBadgeTitleProps = {
  displayName?: string
  showBadge?: boolean
  showTitle?: boolean
  size?: "sm" | "md" | "lg"
}

export function UserBadgeTitle({ displayName, showBadge = true, showTitle = true, size = "md" }: UserBadgeTitleProps) {
  const { equippedItems, loading } = useCustomization()

  if (loading) return null

  const badge = equippedItems.badge
  const title = equippedItems.title

  const sizeClasses = {
    sm: { badge: "h-5 w-5", icon: "h-3 w-3", title: "text-xs" },
    md: { badge: "h-6 w-6", icon: "h-4 w-4", title: "text-sm" },
    lg: { badge: "h-8 w-8", icon: "h-5 w-5", title: "text-base" },
  }

  return (
    <div className="flex items-center gap-2">
      {/* Badge */}
      {showBadge && badge && (
        <div
          className={`${sizeClasses[size].badge} rounded-full flex items-center justify-center flex-shrink-0`}
          style={{
            backgroundColor: (badge.preview_data?.bgColor as string) || "#6366F1",
          }}
          title={badge.name}
        >
          <Star className={sizeClasses[size].icon} style={{ color: (badge.preview_data?.color as string) || "#fff" }} />
        </div>
      )}

      {/* Name and Title */}
      <div className="flex flex-col min-w-0">
        {displayName && <span className="font-medium text-foreground truncate">{displayName}</span>}
        {showTitle && title && (
          <span
            className={`${sizeClasses[size].title} truncate`}
            style={{
              color: (title.preview_data?.color as string) || "#6B7280",
              fontWeight: title.preview_data?.bold ? 600 : 400,
            }}
          >
            {title.preview_data?.text as string}
          </span>
        )}
      </div>
    </div>
  )
}
