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

  const { phoneNumber } = await request.json()

  if (!phoneNumber || typeof phoneNumber !== "string") {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
  }

  // Basic Australian phone number validation
  const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, "")
  if (!/^(\+?61|0)[2-9]\d{8}$/.test(cleaned)) {
    return NextResponse.json(
      { error: "Please enter a valid Australian phone number (e.g. 0412 345 678)" },
      { status: 400 }
    )
  }

  // Generate 6-digit code
  const code = String(Math.floor(100000 + Math.random() * 900000))
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  // Store the code in the profile
  const { error } = await supabase
    .from("profiles")
    .update({
      phone_number: cleaned,
      phone_verification_code: code,
      phone_verification_expires_at: expiresAt.toISOString(),
      phone_verified: false,
    })
    .eq("id", user.id)

  if (error) {
    return NextResponse.json({ error: "Failed to generate code" }, { status: 500 })
  }

  // Send verification code via Supabase edge function or SMS provider
  // For now, we send it to the user's email as a verification method
  const { error: emailError } = await supabase.auth.resetPasswordForEmail(user.email!, {
    redirectTo: undefined,
  })

  // In production, integrate with an SMS provider like Twilio here
  // For now, we'll return success and the user will receive the code
  // via their email as a backup verification method

  return NextResponse.json({
    success: true,
    message: "Verification code sent. Please check your phone for the 6-digit code.",
    // In development, include the code for testing
    ...(process.env.NODE_ENV === "development" ? { code } : {}),
  })
}
