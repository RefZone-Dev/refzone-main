import { createBrowserClient } from "@supabase/ssr"

let clientInstance: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (typeof window === "undefined") {
    // Return a dummy client for SSR that won't make actual requests
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    )
  }

  if (clientInstance) {
    return clientInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  clientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return clientInstance
}
