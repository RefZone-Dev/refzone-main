import Link from "next/link"
import { cn } from "@/lib/utils"

interface RefZoneLogoProps {
  href?: string
  size?: "sm" | "md" | "lg"
  showTagline?: boolean
  className?: string
  variant?: "default" | "light"
}

export function RefZoneLogo({
  href = "/dashboard",
  size = "md",
  showTagline = false,
  className,
  variant = "default",
}: RefZoneLogoProps) {
  const sizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  const copyrightSizes = {
    sm: "text-[8px]",
    md: "text-[10px]",
    lg: "text-xs",
  }

  const Logo = () => (
    <div className={cn("flex items-center font-sans", className)}>
      <span
        className={cn(
          "font-bold bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent",
          sizes[size],
        )}
      >
        R
      </span>
      <span className={cn("font-bold", sizes[size], variant === "light" ? "text-white" : "text-foreground")}>
        efZone
      </span>
      <span className={cn("align-super ml-0.5", copyrightSizes[size], variant === "light" ? "text-gray-400" : "text-muted-foreground")}>
        &#174;
      </span>
      {showTagline && (
        <span className={cn("text-xs ml-2", variant === "light" ? "text-gray-300" : "text-muted-foreground")}>
          Train Your Skills
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        <Logo />
      </Link>
    )
  }

  return <Logo />
}
