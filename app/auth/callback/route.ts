import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Clerk handles OAuth callbacks automatically.
// This route exists as a fallback redirect.
export async function GET(request: NextRequest) {
  const redirectTo = request.nextUrl.searchParams.get("redirectTo") || "/dashboard"
  const url = request.nextUrl.clone()
  url.pathname = redirectTo
  url.search = ""
  return NextResponse.redirect(url)
}
