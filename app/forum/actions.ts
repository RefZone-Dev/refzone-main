"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function deletePost(postId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Verify the user owns this post
  const { data: post } = await supabase.from("forum_posts").select("user_id").eq("id", postId).single()

  if (!post || post.user_id !== user.id) {
    throw new Error("Unauthorized")
  }

  await supabase.from("forum_posts").delete().eq("id", postId)
  redirect("/forum")
}
