'use client'
import { useEffect, useRef } from 'react'

export function ScrollAnimate({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)' }, delay)
        observer.unobserve(el)
      }
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])
  return (
    <div ref={ref} className={className} style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.6s ease-out, transform 0.6s ease-out' }}>
      {children}
    </div>
  )
}
