"use client"

import { useEffect, useState, useCallback } from "react"
import { useCustomization } from "@/lib/customization-context"

type Particle = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
  type: "confetti" | "star" | "circle" | "whistle" | "card" | "trophy"
}

type CustomCelebrationProps = {
  show: boolean
  onComplete?: () => void
  duration?: number
}

export function CustomCelebration({ show, onComplete, duration = 3000 }: CustomCelebrationProps) {
  const { equippedItems } = useCustomization()
  const [particles, setParticles] = useState<Particle[]>([])
  const [isActive, setIsActive] = useState(false)

  const celebrationData = equippedItems.celebration?.preview_data
  const celebrationType = (celebrationData?.type as string) || "confetti"
  const colors = (celebrationData?.colors as string[]) || ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96E6A1"]

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = []
    const particleCount = celebrationType === "fireworks" ? 100 : 60

    for (let i = 0; i < particleCount; i++) {
      let type: Particle["type"] = "confetti"
      if (celebrationType === "stars") type = "star"
      else if (celebrationType === "whistles") type = "whistle"
      else if (celebrationType === "cards") type = "card"
      else if (celebrationType === "trophies") type = "trophy"
      else if (celebrationType === "fireworks") type = Math.random() > 0.5 ? "circle" : "star"

      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: celebrationType === "fireworks" ? 50 + Math.random() * 20 : -10,
        vx: (Math.random() - 0.5) * (celebrationType === "fireworks" ? 4 : 2),
        vy: celebrationType === "fireworks" ? -Math.random() * 3 - 2 : Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        type,
      })
    }
    return newParticles
  }, [celebrationType, colors])

  useEffect(() => {
    if (show && !isActive) {
      setIsActive(true)
      setParticles(createParticles())

      const timer = setTimeout(() => {
        setIsActive(false)
        setParticles([])
        onComplete?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [show, isActive, createParticles, duration, onComplete])

  useEffect(() => {
    if (!isActive || particles.length === 0) return

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.1, // gravity
            rotation: p.rotation + p.rotationSpeed,
          }))
          .filter((p) => p.y < 120),
      )
    }, 16)

    return () => clearInterval(interval)
  }, [isActive, particles.length])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: `rotate(${particle.rotation}deg)`,
            transition: "none",
          }}
        >
          {particle.type === "confetti" && (
            <div
              className="rounded-sm"
              style={{
                width: particle.size,
                height: particle.size * 0.6,
                backgroundColor: particle.color,
              }}
            />
          )}
          {particle.type === "star" && (
            <svg width={particle.size} height={particle.size} viewBox="0 0 24 24" fill={particle.color}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
          {particle.type === "circle" && (
            <div
              className="rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
              }}
            />
          )}
          {particle.type === "whistle" && (
            <svg width={particle.size * 1.5} height={particle.size} viewBox="0 0 24 16" fill={particle.color}>
              <ellipse cx="8" cy="8" rx="8" ry="6" />
              <rect x="14" y="6" width="10" height="4" rx="2" />
            </svg>
          )}
          {particle.type === "card" && (
            <div
              className="rounded-sm border-2"
              style={{
                width: particle.size * 0.7,
                height: particle.size,
                backgroundColor: Math.random() > 0.5 ? "#FBBF24" : "#EF4444",
                borderColor: "rgba(0,0,0,0.2)",
              }}
            />
          )}
          {particle.type === "trophy" && (
            <svg width={particle.size} height={particle.size} viewBox="0 0 24 24" fill={particle.color}>
              <path d="M12 6a4 4 0 0 0-4 4v2c0 2.21 1.79 4 4 4s4-1.79 4-4v-2a4 4 0 0 0-4-4zM8 6V4h8v2M6 8H4v4a4 4 0 0 0 4 4M18 8h2v4a4 4 0 0 1-4 4M10 20h4v2h-4z" />
            </svg>
          )}
        </div>
      ))}
    </div>
  )
}
