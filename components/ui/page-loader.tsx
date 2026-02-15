'use client'

import { useState, useEffect } from 'react'

const FUN_FACTS = [
  "Sounds at or below 70 decibels are considered safe, a Fox 40 whistle is 115 decibels, so yes, referees are deaf.",
  "Red and yellow cards were inspired by traffic lights to communicate across language barriers.",
  "Before the whistle was used in 1878, referees had to get players' attention by waving a handkerchief or shouting.",
  "A referee can lose between 1kg and 2.5kg of body weight in sweat during a single match.",
  "The first referee whistle was invented by Joseph Hudson, a toolmaker who also designed the first police whistle.",
  "A professional soccer referee runs an average of 6 to 8 miles per match, often covering more distance than many of the players on the pitch.",
  "In the early 1900s, some referees used \"goal judges\" who sat on chairs behind the goal line to help determine if the ball had actually gone in.",
  "Before the 1970s, many referees didn't have pockets in their kits. They often tucked their notebooks and cards into their socks or the waistbands of their shorts.",
  "At the 2026 World Cup, referees will be assisted by AI-enabled 3D avatars of all 1,248 players to help detect offsides with millimetre precision.",
  "In the early 20th century, referees didn't wear kits—they wore formal blazers. Imagine sprinting a 40-yard dash in a suit jacket!",
  "At the 2006 World Cup, referee Graham Poll accidentally gave Croatian player Josip Šimunić three yellow cards before finally showing him a red.",
  "From 2000 to 2005, if a team argued with a referee after a free kick was awarded, the ref could move the ball 10 meters forward as a penalty for dissent.",
  "A referee has approximately 0.5 seconds to decide if a contact is a foul, which is faster than the average human's blink-and-think response time.",
  "Goal-line technology sends a \"GOAL\" signal to a referee's smartwatch within one second of the ball crossing the line.",
  "Pierluigi Collina became so famous after the 2002 World Cup that he starred in a Japanese commercial for frozen octopus balls (Takoyaki).",
  "Danish referee Kim Milton Nielsen stood at 6'6\" (198cm), making him significantly taller than almost every player he ever booked.",
  "The Valkeen whistle, used in World Cup finals, is designed to produce a specific pitch that cuts through the noise of 100,000 cheering fans."
]

export function PageLoader({ message = "Loading..." }: { message?: string }) {
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * FUN_FACTS.length))

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % FUN_FACTS.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 max-w-2xl px-6">
        {/* Rolling soccer ball */}
        <div className="relative w-56 h-20 flex items-center justify-center">
          <div className="soccer-ball" />
        </div>

        {/* Loading text with animated dots */}
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-medium text-foreground">{message}</span>
          <span className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
          </span>
        </div>

        {/* Fun fact */}
        <div className="text-center text-sm text-muted-foreground max-w-xl leading-relaxed min-h-[3rem] flex items-center justify-center transition-opacity duration-300">
          {FUN_FACTS[factIndex]}
        </div>

        {/* Subtle progress bar */}
        <div className="h-1 w-48 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/3 rounded-full bg-primary animate-[shimmer_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  )
}

// Simpler inline loader for components
export function InlineLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <div className="relative w-56 h-20 flex items-center justify-center">
        <div className="soccer-ball" />
      </div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}
