import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// Middleware to handle session refresh and route protection
// Public routes (always accessible without auth)
const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/sign-up",
  "/auth/sign-up-success",
  "/auth/callback",
  "/auth/setup-username",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/leaderboard",
  "/api/stats",
  "/api/git-push",
]

// Check if the path is a public read-only route (no auth required)
function isPublicReadOnlyRoute(pathname: string): boolean {
  if (pathname === "/forum") return true
  if (pathname.startsWith("/forum/") && !pathname.includes("/new") && !pathname.includes("/edit")) {
    return true
  }
  if (pathname.startsWith("/user/")) return true
  return false
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Handle OAuth code at root path - redirect to callback handler
  // This happens when Supabase redirects to /?code=... instead of /auth/callback?code=...
  const code = request.nextUrl.searchParams.get("code")
  if (pathname === "/" && code) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/callback"
    // Preserve the code and any other query params
    return NextResponse.redirect(url)
  }

  // Root path "/" - redirect to login if not authenticated, dashboard if authenticated
  if (pathname === "/") {
    if (user) {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // Allow public routes without auth
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    // If user is logged in and on login/signup pages, redirect to dashboard
    // But only if the session is valid (not expired)
    if (user && (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/sign-up"))) {
      // Verify the session is actually valid by checking the user object
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const url = request.nextUrl.clone()
        const redirectTo = request.nextUrl.searchParams.get("redirectTo")
        url.pathname = redirectTo || "/dashboard"
        url.searchParams.delete("redirectTo")
        return NextResponse.redirect(url)
      }
    }
    return supabaseResponse
  }

  // Allow public read-only routes without auth
  if (isPublicReadOnlyRoute(pathname)) {
    return supabaseResponse
  }

  // Everything else requires authentication
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    // Store the original URL to redirect back after login
    if (pathname !== "/") {
      url.searchParams.set("redirectTo", pathname)
    }
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

