import { BadgeCheck } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface VerifiedBadgeProps {
  isVerified: boolean
  className?: string
  showLabel?: boolean
}

export function VerifiedBadge({ isVerified, className = "", showLabel = false }: VerifiedBadgeProps) {
  if (!isVerified) return null

  if (showLabel) {
    return (
      <span className="inline-flex items-center gap-1 text-blue-500">
        <BadgeCheck className={className || "h-4 w-4"} />
        <span className="text-xs font-medium">Staff</span>
      </span>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <BadgeCheck className={`text-blue-500 ${className}`} aria-label="RefZone Staff" />
        </TooltipTrigger>
        <TooltipContent>
          <p>RefZone Staff</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
