import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

const categories = [
  { id: "general", label: "General Discussion" },
  { id: "rules", label: "Laws of the Game" },
  { id: "scenarios", label: "Scenario Help" },
  { id: "tips", label: "Tips & Advice" },
]

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch the post
  const { data: post } = await supabase.from("forum_posts").select("*").eq("id", id).single()

  if (!post) {
    notFound()
  }

  // Check if user is post author
  if (user.id !== post.user_id) {
    redirect(`/forum/${id}`)
  }

  async function updatePost(formData: FormData) {
    "use server"

    const title = formData.get("title")?.toString() || ""
    const content = formData.get("content")?.toString() || ""
    const category = formData.get("category")?.toString() || ""

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || user.id !== post.user_id) {
      throw new Error("Unauthorized")
    }

    await supabase
      .from("forum_posts")
      .update({
        title: title.trim(),
        content: content.trim(),
        category,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    redirect(`/forum/${id}`)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="outline" asChild>
        <Link href={`/forum/${id}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Post
        </Link>
      </Button>

      <Card className="border-2 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Edit Post</CardTitle>
          <CardDescription>Update your post content and category</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updatePost} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-foreground">
                Category
              </Label>
              <Select defaultValue={post.category}>
                <SelectTrigger name="category" className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                defaultValue={post.title}
                className="bg-background text-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-foreground">
                Content
              </Label>
              <Textarea
                id="content"
                name="content"
                defaultValue={post.content}
                rows={8}
                className="resize-none bg-background text-foreground"
                required
              />
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" asChild className="flex-1 bg-transparent">
                <Link href={`/forum/${id}`}>Cancel</Link>
              </Button>
              <Button type="submit" className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
