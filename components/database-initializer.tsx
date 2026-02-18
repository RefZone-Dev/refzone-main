"use client"

import { useEffect, useRef } from "react"

// Client component that ensures single initialization
export function DatabaseInitializer() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Defer initialization to not block initial render
    const timeoutId = setTimeout(() => {
      // Fire-and-forget initialization - don't block rendering
      fetch("/api/init-db", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timestamp: Date.now() })
      }).catch(() => {
        // Silently fail - DB init is best-effort
      })
    }, 2000) // Wait 2 seconds after page load

    return () => clearTimeout(timeoutId)
  }, [])

  return null
}
