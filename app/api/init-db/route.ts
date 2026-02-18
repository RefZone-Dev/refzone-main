import { initDatabase, setupAuthTrigger } from "@/lib/supabase/init-db"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    await initDatabase()
    await setupAuthTrigger()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Database init error:", error)
    return NextResponse.json({ success: false, error: "Init failed" }, { status: 500 })
  }
}
