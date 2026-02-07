import { createClient } from "@/lib/supabase/server"
import { ForumClient } from "./forum-client"
import { isUnder16 } from "@/lib/age-utils"
import { AgeRestrictionBanner } from "@/components/age-restriction-banner"

export default async function CommunityPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check age restriction for logged-in users
  if (user) {
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("date_of_birth")
      .eq("id", user.id)
      .single()

    if (isUnder16(userProfile?.date_of_birth)) {
      return (
        <div className="space-y-8 max-w-4xl mx-auto px-4 py-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-foreground">Forum</h1>
            <p className="text-muted-foreground">Ask questions, share knowledge, and connect with fellow referees</p>
          </div>
          <AgeRestrictionBanner feature="the forum" />
        </div>
      )
    }
  }

  // Fetch approved posts (and own pending if logged in) in parallel
  const [approvedResult, ownPendingResult] = await Promise.all([
    supabase
      .from("forum_posts")
      .select("*")
      .eq("moderation_status", "approved")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(50),
    user
      ? supabase
          .from("forum_posts")
          .select("*")
          .eq("user_id", user.id)
          .eq("moderation_status", "pending_review")
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
  ])

  const approvedPosts = approvedResult.data || []
  const ownPendingPosts = ownPendingResult.data || []

  // Merge and deduplicate
  const allPosts = [...approvedPosts, ...ownPendingPosts]
  const uniquePosts = Array.from(new Map(allPosts.map((p) => [p.id, p])).values())
  const sortedPosts = uniquePosts.sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1
    if (!a.is_pinned && b.is_pinned) return 1
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  if (sortedPosts.length === 0) {
    return <ForumClient posts={[]} userId={user?.id || null} />
  }

  // Collect IDs for batch fetching
  const userIds = [...new Set(sortedPosts.map((p) => p.user_id).filter(Boolean))]
  const postIds = sortedPosts.map((p) => p.id)

  // Batch fetch all related data in parallel
  const [profilesResult, replyCountsResult, voteCountsResult, customizationsResult] = await Promise.all([
    userIds.length > 0
      ? supabase.from("profiles").select("id, display_name, total_points, is_verified").in("id", userIds)
      : Promise.resolve({ data: [] }),
    supabase.from("forum_replies").select("post_id").in("post_id", postIds),
    supabase.from("forum_votes").select("post_id, vote_type").in("post_id", postIds),
    userIds.length > 0
      ? supabase.from("user_customization").select("user_id, active_badge_id").in("user_id", userIds)
      : Promise.resolve({ data: [] }),
  ])

  const profileMap = new Map()
  profilesResult.data?.forEach((p) => profileMap.set(p.id, p))

  const replyCountMap = new Map<string, number>()
  replyCountsResult.data?.forEach((r) => {
    replyCountMap.set(r.post_id, (replyCountMap.get(r.post_id) || 0) + 1)
  })

  const voteCountMap = new Map<string, number>()
  voteCountsResult.data?.forEach((v) => {
    voteCountMap.set(v.post_id, (voteCountMap.get(v.post_id) || 0) + v.vote_type)
  })

  // Fetch badges in one query
  const badgeIds = customizationsResult.data?.map((c) => c.active_badge_id).filter(Boolean) || []
  const { data: badges } =
    badgeIds.length > 0 ? await supabase.from("shop_items").select("*").in("id", badgeIds) : { data: [] }

  const userBadgeMap = new Map()
  customizationsResult.data?.forEach((c) => {
    if (c.active_badge_id) {
      const badge = badges?.find((b) => b.id === c.active_badge_id)
      if (badge) userBadgeMap.set(c.user_id, badge)
    }
  })

  // Enrich posts
  const enrichedPosts = sortedPosts.map((post) => ({
    ...post,
    profiles: post.user_id
      ? profileMap.get(post.user_id) || { display_name: "Unknown User", total_points: 0, is_verified: false }
      : null,
    reply_count: replyCountMap.get(post.id) || 0,
    vote_count: voteCountMap.get(post.id) || 0,
    user_badge: post.user_id ? userBadgeMap.get(post.user_id) || null : null,
  }))

  return <ForumClient posts={enrichedPosts} userId={user?.id || null} />
}
