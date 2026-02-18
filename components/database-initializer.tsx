import { initDatabase, setupAuthTrigger } from "@/lib/supabase/init-db"

// Server component that runs database initialization
export async function DatabaseInitializer() {
  // Only run in production/server context
  if (typeof window === "undefined") {
    try {
      await initDatabase()
      await setupAuthTrigger()
    } catch (error) {
      console.error("[DB Init] Failed to initialize database:", error)
    }
  }
  
  return null
}
