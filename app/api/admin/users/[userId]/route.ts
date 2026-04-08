import { requireAdmin } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await requireAdmin()
    const { userId } = await params

    const serviceClient = createServiceClient()
    const { data: profile, error } = await serviceClient
      .from("profiles")
      .select("id, display_name, experience_level, total_points, current_streak, longest_streak, is_admin, created_at, updated_at, has_set_username")
      .eq("id", userId)
      .single()

    if (error || !profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get email from Clerk
    let email = "N/A"
    try {
      const clerk = await clerkClient()
      const clerkUser = await clerk.users.getUser(userId)
      email = clerkUser.emailAddresses?.[0]?.emailAddress || "N/A"
    } catch {}

    return NextResponse.json({ ...profile, email })
  } catch {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await requireAdmin()
    const { userId } = await params

    const serviceClient = createServiceClient()

    // Delete profile first
    const { error: profileError } = await serviceClient
      .from("profiles")
      .delete()
      .eq("id", userId)

    if (profileError) {
      return NextResponse.json({ error: "Failed to delete user profile", details: profileError.message }, { status: 500 })
    }

    // Delete Clerk auth user
    try {
      const clerk = await clerkClient()
      await clerk.users.deleteUser(userId)
    } catch (err) {
      console.error("Failed to delete Clerk user:", err)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }
}
