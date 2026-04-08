import { requireAdmin } from "@/lib/auth"
import { NextResponse } from "next/server"

// With Clerk, password resets are managed through Clerk's dashboard or user-initiated flows.
// This endpoint is kept for API compatibility but returns a guidance message.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await requireAdmin()
    // Clerk handles password resets via its own UI/email flow.
    // Admins can trigger this from the Clerk dashboard.
    return NextResponse.json({
      success: true,
      message: "Password resets are managed through Clerk. The user can reset via the sign-in page.",
    })
  } catch {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }
}
