import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that should completely skip Clerk middleware — no server-side API calls
const bypassPaths = [
  '/',
  '/features',
  '/referees',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/sitemap-page',
  '/auth',
  '/leaderboard',
  '/weekly-quiz',
]

function shouldBypassClerk(pathname: string): boolean {
  return bypassPaths.some(p =>
    pathname === p || pathname.startsWith(p + '/')
  )
}

const isPublicRoute = createRouteMatcher([
  '/auth/login(.*)',
  '/auth/sign-up(.*)',
  '/auth/sign-up-success(.*)',
  '/auth/callback(.*)',
  '/auth/forgot-password(.*)',
  '/auth/reset-password(.*)',
  '/user/(.*)',
  '/api/cron/(.*)',
])

// Main middleware: skip Clerk entirely for marketing routes
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Marketing + auth routes — bypass Clerk middleware completely
  if (shouldBypassClerk(pathname)) {
    return NextResponse.next()
  }

  // All other routes — go through Clerk
  return clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
      await auth.protect()
    }
  })(request, {} as any)
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|json)).*)',
    '/(api|trpc)(.*)',
  ],
}
