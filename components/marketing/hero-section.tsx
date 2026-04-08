'use client'

export function HeroSectionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <section
      id="hero-section"
      className="relative overflow-hidden bg-[#0a0a0f] px-9 pt-40 pb-28 md:pt-48 md:pb-36"
    >
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="animate-orb absolute -top-[200px] left-[10%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-purple-600/20 to-pink-500/10 blur-3xl" />
        <div className="animate-orb-delayed absolute -bottom-[100px] right-[15%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-pink-600/10 to-purple-600/15 blur-3xl" />
        <div className="animate-orb absolute top-[30%] left-[50%] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-gradient-to-br from-pink-600/8 to-purple-600/5 blur-3xl" />
      </div>

      {/* Floating accent dots */}
      <div className="absolute top-20 left-16 h-1 w-1 rounded-full bg-purple-500/30 animate-pulse-glow" />
      <div className="absolute top-32 right-24 h-1.5 w-1.5 rounded-full bg-pink-500/20 animate-pulse-glow" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-[20%] h-1 w-1 rounded-full bg-purple-400/25 animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-32 right-[30%] h-1.5 w-1.5 rounded-full bg-pink-400/20 animate-pulse-glow" style={{ animationDelay: '0.5s' }} />

      {/* Dot grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top gradient fade for navbar transition */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(10,10,15,0))',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  )
}
