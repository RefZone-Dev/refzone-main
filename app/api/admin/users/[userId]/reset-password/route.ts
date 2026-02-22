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

  // Get user email
  try {
    const { data: authUser } = await serviceClient.auth.admin.getUserById(userId)
    const email = authUser?.user?.email

    if (!email) {
      return NextResponse.json({ message: "User email not found" }, { status: 404 })
    }

    // Use Supabase's built-in password reset
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.refzone.com.au'}/auth/reset-password`,
    })

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Failed to send password reset:", err)
    return NextResponse.json({ message: "Failed to send password reset email" }, { status: 500 })
  }
}
