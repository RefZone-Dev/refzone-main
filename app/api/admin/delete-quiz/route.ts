import { createServiceClient } from "@/lib/supabase/service"
import { NextResponse } from "next/server"

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get("id")
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    if (!quizId) {
      return NextResponse.json({ error: "Missing quiz ID" }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Verify user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single()

    if (profileError || !profile?.is_admin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    // Delete in order: answers -> attempts -> questions -> quiz
    const { data: attempts } = await supabase.from("quiz_attempts").select("id").eq("quiz_id", quizId)

    if (attempts && attempts.length > 0) {
      const attemptIds = attempts.map((a) => a.id)
      await supabase.from("quiz_answers").delete().in("attempt_id", attemptIds)
      await supabase.from("quiz_attempts").delete().eq("quiz_id", quizId)
    }

    // Delete questions
    await supabase.from("quiz_questions").delete().eq("quiz_id", quizId)

    // Delete the quiz using service role (bypasses RLS)
    const { error: deleteError } = await supabase.from("quizzes").delete().eq("id", quizId)

    if (deleteError) {
      console.error("[v0] Error deleting quiz:", deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    // Verify deletion
    const { data: stillExists } = await supabase.from("quizzes").select("id").eq("id", quizId).single()

    if (stillExists) {
      return NextResponse.json({ error: "Quiz still exists after delete attempt" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete quiz error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
