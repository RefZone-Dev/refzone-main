"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { cn } from "@/lib/utils"

type VoteButtonProps = {
  postId?: string
  replyId?: string
  currentVote: number
  voteCount: number
}

export function VoteButton({ postId, replyId, currentVote, voteCount }: VoteButtonProps) {
  const [vote, setVote] = useState(currentVote)
  const [count, setCount] = useState(voteCount)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleVote(newVote: 1 | -1) {
    setIsLoading(true)

    try {
      const supabase = createClient()

      let user = null
      try {
        const { data } = await supabase.auth.getUser()
        user = data?.user
      } catch {
        // Auth error - redirect to login
      }

      if (!user) {
        router.push("/auth/login")
        return
      }

      const voteData = postId ? { post_id: postId } : { reply_id: replyId }

      if (vote === newVote) {
        // Remove vote
        await supabase
          .from("forum_votes")
          .delete()
          .eq("user_id", user.id)
          .eq(postId ? "post_id" : "reply_id", postId || replyId)

        setCount(count - newVote)
        setVote(0)
      } else {
        if (vote !== 0) {
          // Update existing vote
          await supabase
            .from("forum_votes")
            .update({ vote_type: newVote })
            .eq("user_id", user.id)
            .eq(postId ? "post_id" : "reply_id", postId || replyId)

          setCount(count - vote + newVote)
        } else {
          // Create new vote
          await supabase.from("forum_votes").insert({
            user_id: user.id,
            vote_type: newVote,
            ...voteData,
          })

          setCount(count + newVote)
        }
        setVote(newVote)
      }
    } catch (err) {
      console.error("Error voting:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote(1)}
        disabled={isLoading}
        className={cn("h-8 w-8 p-0", vote === 1 && "text-green-500")}
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <span className="text-lg font-bold text-foreground">{count}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote(-1)}
        disabled={isLoading}
        className={cn("h-8 w-8 p-0", vote === -1 && "text-red-500")}
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
    </div>
  )
}
