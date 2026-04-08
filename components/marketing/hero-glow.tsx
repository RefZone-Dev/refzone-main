'use client'
import { useEffect, useRef } from 'react'

/**
 * Professional cursor-reactive dot grid + subtle radial glow.
 * Dots near the cursor brighten — clean and corporate.
 */
export function HeroGlow({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -1, y: -1 })

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isMobile = window.matchMedia('(max-width: 768px)').matches
    if (isMobile) return

    let rafId = 0
    let running = true

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouse.current.x = e.clientX - rect.left
      mouse.current.y = e.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouse.current = { x: -1, y: -1 }
    }

    container.addEventListener('mousemove', handleMouseMove, { passive: true })
    container.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    function draw() {
      if (!running || !ctx || !canvas || !container) return

      const rect = container.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio, 2)
      const w = rect.width
      const h = rect.height

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr
        canvas.height = h * dpr
        canvas.style.width = `${w}px`
        canvas.style.height = `${h}px`
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }

      ctx.clearRect(0, 0, w, h)

      const spacing = 48
      const cols = Math.ceil(w / spacing) + 1
      const rows = Math.ceil(h / spacing) + 1
      const mx = mouse.current.x
      const my = mouse.current.y
      const radius = 180

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing
          const y = r * spacing
          const dx = mx - x
          const dy = my - y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const influence = Math.max(0, 1 - dist / radius)

          const alpha = 0.06 + influence * 0.35
          const size = 1 + influence * 1.5

          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(200, 160, 255, ${alpha})`
          ctx.fill()
        }
      }

      if (mx > 0 && my > 0) {
        const grd = ctx.createRadialGradient(mx, my, 0, mx, my, 250)
        grd.addColorStop(0, 'rgba(145, 20, 175, 0.08)')
        grd.addColorStop(0.5, 'rgba(255, 94, 184, 0.04)')
        grd.addColorStop(1, 'transparent')
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, w, h)
      }

      rafId = requestAnimationFrame(draw)
    }

    // Only run when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          running = true
          rafId = requestAnimationFrame(draw)
        } else {
          running = false
          cancelAnimationFrame(rafId)
        }
      },
      { threshold: 0 }
    )
    observer.observe(container)

    return () => {
      running = false
      cancelAnimationFrame(rafId)
      observer.disconnect()
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [containerRef])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    />
  )
}
