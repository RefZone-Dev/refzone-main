"use client"

import type React from "react"

import { useCustomization } from "@/lib/customization-context"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type FeedbackCardProps = {
  isCorrect: boolean
  children: React.ReactNode
  className?: string
}

export function FeedbackCard({ isCorrect, children, className }: FeedbackCardProps) {
  const { equippedItems } = useCustomization()

  const cardDesign = equippedItems.card_design?.preview_data
  const style = (cardDesign?.style as string) || "classic"

  const correctColor = (cardDesign?.correctColor as string) || "#22C55E"
  const incorrectColor = (cardDesign?.incorrectColor as string) || "#EF4444"

  const baseColor = isCorrect ? correctColor : incorrectColor
  const hasGlow = cardDesign?.glow || cardDesign?.neon
  const hasAnimation = cardDesign?.animated || cardDesign?.pulse
  const hasParticles = cardDesign?.particles
  const isHolographic = cardDesign?.holographic || cardDesign?.rainbow
  const hasShine = cardDesign?.shine || cardDesign?.goldTrim

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 bg-card",
        hasAnimation && "animate-pulse",
        className,
      )}
      style={{
        borderColor: baseColor,
        borderWidth: "2px",
        boxShadow: hasGlow ? `0 0 20px ${baseColor}40, 0 0 40px ${baseColor}20` : undefined,
        background: isHolographic
          ? `linear-gradient(135deg, ${baseColor}10, ${baseColor}05, ${isCorrect ? "#A855F7" : "#F59E0B"}10)`
          : undefined,
      }}
    >
      {/* Shine effect overlay */}
      {hasShine && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, transparent 40%, ${baseColor}20 50%, transparent 60%)`,
            animation: "shine 2s infinite",
          }}
        />
      )}

      {/* Gold trim for championship edition */}
      {cardDesign?.goldTrim && (
        <div className="absolute inset-0 pointer-events-none border-4 border-yellow-400/30 rounded-lg" />
      )}

      {/* Holographic shimmer */}
      {isHolographic && (
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background:
              "linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0080ff, #8000ff, #ff0080)",
            backgroundSize: "400% 400%",
            animation: "holographic 3s ease infinite",
          }}
        />
      )}

      <CardContent className="relative z-10 p-6">
        <div className="flex items-start gap-4">
          <div
            className={cn("p-2 rounded-full", hasGlow && "shadow-lg")}
            style={{
              backgroundColor: `${baseColor}20`,
              boxShadow: hasGlow ? `0 0 15px ${baseColor}60` : undefined,
            }}
          >
            {isCorrect ? (
              <CheckCircle2 className="h-8 w-8" style={{ color: baseColor }} />
            ) : (
              <XCircle className="h-8 w-8" style={{ color: baseColor }} />
            )}
          </div>
          <div className="flex-1 text-foreground">{children}</div>
        </div>
      </CardContent>

      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes holographic {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </Card>
  )
}
