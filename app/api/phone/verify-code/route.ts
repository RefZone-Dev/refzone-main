import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { code } = await request.json()

  if (!code || typeof code !== "string" || code.length !== 6) {
    return NextResponse.json({ error: "Please enter a valid 6-digit code" }, { status: 400 })
  }

  // Fetch stored code
  const { data: profile } = await supabase
    .from("profiles")
    .select("phone_verification_code, phone_verification_expires_at")
    .eq("id", user.id)
    .single()

  if (!profile?.phone_verification_code) {
    return NextResponse.json({ error: "No verification code found. Please request a new one." }, { status: 400 })
  }

  // Check expiry
  if (new Date(profile.phone_verification_expires_at) < new Date()) {
    return NextResponse.json({ error: "Verification code has expired. Please request a new one." }, { status: 400 })
  }

  // Check code match
  if (profile.phone_verification_code !== code) {
    return NextResponse.json({ error: "Incorrect verification code. Please try again." }, { status: 400 })
  }

  // Mark as verified and clear the code
  const { error } = await supabase
    .from("profiles")
    .update({
      phone_verified: true,
      phone_verification_code: null,
      phone_verification_expires_at: null,
      phone_prompt_shown: true,
    })
    .eq("id", user.id)

  if (error) {
    return NextResponse.json({ error: "Failed to verify phone number" }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: "Phone number verified successfully" })
}
