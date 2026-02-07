import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { token, platform, deviceId } = await request.json()
    
    if (!token || !platform) {
      return NextResponse.json(
        { error: "Token and platform are required" },
        { status: 400 }
      )
    }
    
    if (!['ios', 'android', 'web'].includes(platform)) {
      return NextResponse.json(
        { error: "Invalid platform. Must be ios, android, or web" },
        { status: 400 }
      )
    }
    
    // Upsert the push token - update if exists, insert if not
    const { data, error } = await supabase
      .from("push_tokens")
      .upsert(
        {
          user_id: user.id,
          token,
          platform,
          device_id: deviceId || null,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,token",
        }
      )
      .select()
      .single()
    
    if (error) {
      console.error("[v0] Error registering push token:", error)
      return NextResponse.json(
        { error: "Failed to register push token" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      tokenId: data?.id 
    })
  } catch (error) {
    console.error("[v0] Push token registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Deactivate a push token (when user logs out or disables notifications)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { token } = await request.json()
    
    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      )
    }
    
    // Deactivate the token instead of deleting (for audit trail)
    const { error } = await supabase
      .from("push_tokens")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("token", token)
    
    if (error) {
      console.error("[v0] Error deactivating push token:", error)
      return NextResponse.json(
        { error: "Failed to deactivate push token" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Push token deactivation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
