import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"
import { NextResponse } from "next/server"

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const serviceClient = createServiceClient()
  const { data: profile } = await serviceClient
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) return null
  return { user, serviceClient }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  const auth = await verifyAdmin()
  if (!auth) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  const { data: profile, error } = await auth.serviceClient
    .from("profiles")
    .select("id, display_name, experience_level, total_points, current_streak, longest_streak, is_admin, created_at, updated_at, has_set_username")
    .eq("id", userId)
    .single()

  if (error || !profile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Get auth email
  let email = "N/A"
  try {
    const { data: authUser } = await auth.serviceClient.auth.admin.getUserById(userId)
    email = authUser?.user?.email || "N/A"
  } catch {}

  return NextResponse.json({ ...profile, email })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  const auth = await verifyAdmin()
  if (!auth) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  // Delete profile first
  const { error: profileError } = await auth.serviceClient
    .from("profiles")
    .delete()
    .eq("id", userId)

  if (profileError) {
    return NextResponse.json({ error: "Failed to delete user profile", details: profileError.message }, { status: 500 })
  }

  // Delete auth user
  try {
    await auth.serviceClient.auth.admin.deleteUser(userId)
  } catch (err) {
    console.error("Failed to delete auth user:", err)
  }

  return NextResponse.json({ success: true })
}
