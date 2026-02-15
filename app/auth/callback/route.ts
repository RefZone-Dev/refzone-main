import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const redirectTo = requestUrl.searchParams.get("redirectTo") || "/dashboard"
  const error = requestUrl.searchParams.get("error")
  const errorDescription = requestUrl.searchParams.get("error_description")
  
  // Use environment variable for proper origin, fallback to request origin for local dev
  const baseOrigin = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin

  // Handle OAuth errors
  if (error) {
    const loginUrl = new URL("/auth/login", baseOrigin)
    loginUrl.searchParams.set("error", errorDescription || error)
    return NextResponse.redirect(loginUrl)
  }

  if (code) {
    const supabase = await createClient()
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      const loginUrl = new URL("/auth/login", baseOrigin)
      loginUrl.searchParams.set("error", exchangeError.message || "Failed to complete sign in")
      return NextResponse.redirect(loginUrl)
    }

    // Check if user needs to set up their username (OAuth users)
    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, has_set_username")
        .eq("id", data.user.id)
        .single()

      // Redirect to username setup if:
      // 1. No profile or display_name is missing
      // 2. display_name contains "@" (email-based)
      // 3. The user has never explicitly set a username (has_set_username is false/null)
      const isOAuthUser = data.user.app_metadata?.provider !== "email"
      const needsUsername = !profile?.display_name 
        || profile.display_name.includes("@") 
        || (isOAuthUser && !profile.has_set_username)
      
      if (needsUsername) {
        return NextResponse.redirect(new URL("/auth/setup-username", baseOrigin))
      }
    }
    
    // Successfully authenticated - redirect to the intended destination
    const destination = new URL(redirectTo, baseOrigin)
    return NextResponse.redirect(destination)
  }

  // No code provided - redirect to login
  return NextResponse.redirect(new URL("/auth/login", baseOrigin))
}
