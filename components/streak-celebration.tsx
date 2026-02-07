"use client"

import { useEffect } from "react"
import { Flame } from "lucide-react"
import confetti from "canvas-confetti"

interface StreakCelebrationProps {
  streakDays: number
  onClose: () => void
}

export function StreakCelebration({ streakDays, onClose }: StreakCelebrationProps) {
  useEffect(() => {
    // Fire confetti from multiple positions
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#FF6B35", "#F7931E", "#FDC830"],
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#FF6B35", "#F7931E", "#FDC830"],
      })
    }, 250)

    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-2xl w-full mx-4 text-center">
        {/* Animated flame icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping">
              <Flame className="h-32 w-32 text-orange-500 opacity-75" />
            </div>
            <Flame className="h-32 w-32 text-orange-500 relative z-10 animate-pulse" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-2xl animate-bounce">
            {streakDays} DAY STREAK!
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-orange-400 drop-shadow-lg">
            You're on fire! Keep it going! 🔥
          </p>
          <p className="text-lg text-gray-300 mt-4">Training completed today</p>
        </div>
      </div>
    </div>
  )
}
