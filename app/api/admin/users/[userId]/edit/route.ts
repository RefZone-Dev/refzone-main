import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"
import { NextResponse } from "next/server"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const serviceClient = createServiceClient()
  const { data: adminProfile } = await serviceClient
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (!adminProfile?.is_admin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  const body = await request.json()
  const { display_name, experience_level, is_admin, total_points, current_streak } = body

  const updateData: Record<string, any> = {}
  if (display_name !== undefined) updateData.display_name = display_name
  if (experience_level !== undefined) updateData.experience_level = experience_level
  if (is_admin !== undefined) updateData.is_admin = is_admin
  if (total_points !== undefined) updateData.total_points = total_points
  if (current_streak !== undefined) updateData.current_streak = current_streak

  const { error } = await serviceClient
    .from("profiles")
    .update(updateData)
    .eq("id", userId)

  if (error) {
    return NextResponse.json({ error: "Failed to update user", message: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
