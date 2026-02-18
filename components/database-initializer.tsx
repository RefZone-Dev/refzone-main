"use client"

import { useEffect, useRef } from "react"

// Client component that ensures single initialization
export function DatabaseInitializer() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Fire-and-forget initialization - don't block rendering
    fetch("/api/init-db", { method: "POST" }).catch(() => {
      // Silently fail - DB init is best-effort
    })
  }, [])

  return null
}
