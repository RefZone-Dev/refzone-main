import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { PostDetailClient } from "./post-detail-client"
import { isUnder16 } from "@/lib/age-utils"
import { AgeRestrictionBanner } from "@/components/age-restriction-banner"

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    notFound()
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check age restriction for logged-in users
  if (user) {
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("date_of_birth")
      .eq("id", user.id)
      .single()

    if (isUnder16(currentProfile?.date_of_birth)) {
      return (
        <div className="p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">Forum Post</h1>
          <AgeRestrictionBanner feature="the forum" />
        </div>
      )
    }
  }

  const { data: post } = await supabase.from("forum_posts").select("*").eq("id", id).single()

  if (!post) {
    notFound()
  }

  const { data: authorProfile } = await supabase
    .from("profiles")
    .select("display_name, total_points, is_verified")
    .eq("id", post.user_id)
    .single()

  // Increment view count
  await supabase
    .from("forum_posts")
    .update({ view_count: post.view_count + 1 })
    .eq("id", id)

  const { data: replies } = await supabase
    .from("forum_replies")
    .select("*")
    .eq("post_id", id)
    .order("is_accepted_answer", { ascending: false })
    .order("created_at", { ascending: true })

  const replyUserIds = [...new Set(replies?.map((r) => r.user_id) || [])]
  const { data: replyProfiles } =
    replyUserIds.length > 0
      ? await supabase.from("profiles").select("id, display_name, total_points, is_verified").in("id", replyUserIds)
      : { data: [] }

  const replyProfileMap: Record<string, any> = {}
  replyProfiles?.forEach((p) => {
    replyProfileMap[p.id] = p
  })

  const repliesWithProfiles =
    replies?.map((r) => ({
      ...r,
      profiles: replyProfileMap[r.user_id] || { display_name: "Unknown", total_points: 0, is_verified: false },
    })) || []

  // Get vote counts
  const { data: postVotes } = await supabase.from("forum_votes").select("vote_type").eq("post_id", id)

  const postVoteCount = postVotes?.reduce((sum, v) => sum + v.vote_type, 0) || 0

  let userPostVote = null
  let userReplyVotes = null

  if (user) {
    const { data: vote } = await supabase
      .from("forum_votes")
      .select("vote_type")
      .eq("post_id", id)
      .eq("user_id", user.id)
      .maybeSingle()

    userPostVote = vote

    // Get user votes on replies
    const replyIds = replies?.map((r) => r.id) || []
    const { data: votes } =
      replyIds.length > 0
        ? await supabase
            .from("forum_votes")
            .select("reply_id, vote_type")
            .in("reply_id", replyIds)
            .eq("user_id", user.id)
        : { data: [] }

    userReplyVotes = votes
  }

  // Get reply vote counts
  const replyIds = replies?.map((r) => r.id) || []
  const { data: replyVotes } =
    replyIds.length > 0
      ? await supabase.from("forum_votes").select("reply_id, vote_type").in("reply_id", replyIds)
      : { data: [] }

  const replyVoteMap: Record<string, number> = {}
  replyVotes?.forEach((v) => {
    if (v.reply_id) {
      replyVoteMap[v.reply_id] = (replyVoteMap[v.reply_id] || 0) + v.vote_type
    }
  })

  const userReplyVoteMap: Record<string, number> = {}
  userReplyVotes?.forEach((v) => {
    if (v.reply_id) {
      userReplyVoteMap[v.reply_id] = v.vote_type
    }
  })

  // Get user badges for post author and reply authors
  const allUserIds = [post.user_id, ...(replies?.map((r) => r.user_id) || [])]
  const { data: userCustomizations } = await supabase
    .from("user_customization")
    .select("user_id, active_badge_id")
    .in("user_id", allUserIds)

  const badgeIds = userCustomizations?.map((c) => c.active_badge_id).filter(Boolean) || []
  const { data: badges } =
    badgeIds.length > 0 ? await supabase.from("shop_items").select("*").in("id", badgeIds) : { data: [] }

  const userBadgeMap: Record<string, any> = {}
  userCustomizations?.forEach((c) => {
    if (c.active_badge_id) {
      const badge = badges?.find((b) => b.id === c.active_badge_id)
      if (badge) userBadgeMap[c.user_id] = badge
    }
  })

  const postWithProfile = {
    ...post,
    profiles: authorProfile || { display_name: "Unknown", total_points: 0, is_verified: false },
  }

  return (
    <PostDetailClient
      post={postWithProfile}
      replies={repliesWithProfiles}
      postVoteCount={postVoteCount}
      userPostVote={userPostVote?.vote_type || 0}
      replyVoteMap={replyVoteMap}
      userReplyVoteMap={userReplyVoteMap}
      userBadgeMap={userBadgeMap}
      currentUserId={user?.id || null}
      isLoggedIn={!!user}
    />
  )
}
