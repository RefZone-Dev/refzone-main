import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Reply, Star, Trophy, Calendar } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { VerifiedBadge } from "@/components/verified-badge"
import { checkFeatureClosure } from "@/lib/feature-closures"
import { FeatureClosure } from "@/components/ui/feature-closure"

export const metadata = {
  title: "RefZone",
  description: "View your profile, posts, and achievements",
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if profile is closed
  const closure = await checkFeatureClosure('profile')
  if (closure) {
    return <FeatureClosure closure={closure} />
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch user's posts
  const { data: posts } = await supabase
    .from("forum_posts")
    .select(`
      *,
      forum_replies(count)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch user's replies
  const { data: replies } = await supabase
    .from("forum_replies")
    .select(`
      *,
      forum_posts(id, title)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20)

  // Fetch user's customization
  const { data: customization } = await supabase
    .from("user_customization")
    .select(`
      active_badge_id,
      active_theme_id,
      shop_items!user_customization_active_badge_id_fkey(name, preview_data)
    `)
    .eq("user_id", user.id)
    .maybeSingle()

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
              {profile?.display_name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{profile?.display_name || "User"}</h1>
                <VerifiedBadge isVerified={profile?.is_verified || false} className="h-5 w-5" />
                {customization?.shop_items && (
                  <Badge variant="secondary" className="gap-1">
                    <Star className="h-3 w-3 text-amber-500" />
                    {(customization.shop_items as any).name}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  {profile?.total_points || 0} points
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  {posts?.length || 0} posts
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined{" "}
                  {profile?.created_at
                    ? formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })
                    : "recently"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">{profile?.current_streak || 0}</p>
            <p className="text-sm text-muted-foreground">Current Streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-amber-500">{profile?.longest_streak || 0}</p>
            <p className="text-sm text-muted-foreground">Longest Streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-500">{posts?.length || 0}</p>
            <p className="text-sm text-muted-foreground">Forum Posts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-blue-500">{replies?.length || 0}</p>
            <p className="text-sm text-muted-foreground">Replies</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Posts and Replies */}
      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="replies">Replies</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          {posts && posts.length > 0 ? (
            posts.map((post: any) => (
              <Card key={post.id} className="hover:bg-accent/50 transition-colors">
                <CardContent className="pt-4">
                  <Link href={`/forum/${post.id}`} className="block">
                    <h3 className="font-semibold hover:text-primary">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{post.content}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{post.category}</span>
                      <span>{post.forum_replies?.[0]?.count || 0} replies</span>
                      <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>You haven't posted anything yet</p>
                <Link href="/forum/new" className="text-primary hover:underline text-sm">
                  Create your first post
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="replies" className="space-y-4">
          {replies && replies.length > 0 ? (
            replies.map((reply: any) => (
              <Card key={reply.id} className="hover:bg-accent/50 transition-colors">
                <CardContent className="pt-4">
                  <Link href={`/forum/${reply.post_id}`} className="block">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Reply className="h-4 w-4" />
                      <span>Reply to: {reply.forum_posts?.title || "Deleted post"}</span>
                    </div>
                    <p className="text-sm line-clamp-2">{reply.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                    </p>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Reply className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>You haven't replied to any posts yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>


      </Tabs>
    </div>
  )
}
