"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth, useUser } from "@clerk/nextjs"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { ArrowLeft, Shield, Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CustomModal } from "@/components/custom-modal"

interface Feedback {
  id: string
  feedback_type: string
  feedback_text: string
  rating: number | null
  created_at: string
  profiles: {
    display_name: string | null
  }
}

export default function AdminFeedbackPage() {
  const { userId } = useAuth()
  const { user: clerkUser } = useUser()
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const [modal, setModal] = useState({
    isOpen: false,
    type: "info" as "success" | "error" | "warning" | "info" | "confirm",
    title: "",
    message: "",
    onConfirm: () => {},
  })

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!userId) {
        router.push("/auth/login")
        return
      }

      const email = clerkUser?.primaryEmailAddress?.emailAddress
      const adminEmails = ["henrytowen@googlemail.com", "refzone.office@gmail.com"]
      if (!email || !adminEmails.includes(email)) {
        router.push("/dashboard")
        return
      }

      const supabase = createClient()

      const { data } = await supabase
        .from("user_feedback")
        .select("*, profiles!user_feedback_user_id_fkey(display_name)")
        .order("created_at", { ascending: false })

      if (data) {
        setFeedback(data as Feedback[])
      }

      setIsLoading(false)
    }

    fetchFeedback()
  }, [router, clerkUser])

  const deleteFeedback = async (feedbackId: string) => {
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Delete Feedback",
      message: "Are you sure you want to delete this feedback?",
      onConfirm: async () => {
        const supabase = createClient()
        await supabase.from("user_feedback").delete().eq("id", feedbackId)
        setFeedback(feedback.filter((f) => f.id !== feedbackId))
        setModal({ ...modal, isOpen: false })
      },
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bug":
        return "bg-red-100 text-red-700 border-red-200"
      case "feature":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "improvement":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <CustomModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
      />

      <div className="flex items-center gap-4">
        <Button variant="outline" asChild className="cursor-pointer bg-transparent">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">User Feedback</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Feedback ({feedback.length})</CardTitle>
          <CardDescription>Review user feedback and suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading feedback...</p>
          ) : (
            <div className="space-y-3">
              {feedback.map((item) => (
                <div key={item.id} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getTypeColor(item.feedback_type)}>{item.feedback_type}</Badge>
                        {item.rating && (
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < item.rating! ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-sm mb-2">{item.feedback_text}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>From {item.profiles?.display_name || "Anonymous"}</span>
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteFeedback(item.id)}
                      className="cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {feedback.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No feedback received yet.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
