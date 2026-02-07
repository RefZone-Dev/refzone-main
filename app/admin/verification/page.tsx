"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { CheckCircle2, XCircle, Search, Shield, Clock, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

interface VerificationRequest {
  id: string
  display_name: string
  verification_requested: boolean
  verification_requested_at: string | null
  is_verified: boolean
  created_at: string
}

export default function VerificationManagement() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [requests, setRequests] = useState<VerificationRequest[]>([])
  const [verifiedUsers, setVerifiedUsers] = useState<VerificationRequest[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [processing, setProcessing] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAdminAndFetchData()
  }, [])

  const checkAdminAndFetchData = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

    if (!profile?.is_admin) {
      router.push("/dashboard")
      return
    }

    setIsAdmin(true)
    await loadVerificationData()
    setIsLoading(false)
  }

  const loadVerificationData = async () => {
    const supabase = createClient()

    // Get pending verification requests
    const { data: pendingData, error: pendingError } = await supabase
      .from("profiles")
      .select("id, display_name, verification_requested, verification_requested_at, is_verified, created_at")
      .eq("verification_requested", true)
      .eq("is_verified", false)
      .order("verification_requested_at", { ascending: false })

    console.log("[v0] Pending verification requests:", pendingData, "Error:", pendingError)

    // Get verified users
    const { data: verifiedData, error: verifiedError } = await supabase
      .from("profiles")
      .select("id, display_name, verification_requested, verification_requested_at, is_verified, created_at")
      .eq("is_verified", true)
      .order("verification_requested_at", { ascending: false })
      .limit(20)

    console.log("[v0] Verified users:", verifiedData, "Error:", verifiedError)

    setRequests(pendingData || [])
    setVerifiedUsers(verifiedData || [])
  }

  const handleVerify = async (userId: string, action: "approve" | "reject") => {
    setProcessing(userId)

    try {
      const supabase = createClient()

      if (action === "approve") {
        const { error } = await supabase
          .from("profiles")
          .update({
            is_verified: true,
            verification_requested: false,
          })
          .eq("id", userId)

        if (error) throw error

        toast({
          title: "User verified",
          description: "The user has been verified successfully.",
        })
      } else {
        const { error } = await supabase
          .from("profiles")
          .update({
            verification_requested: false,
          })
          .eq("id", userId)

        if (error) throw error

        toast({
          title: "Request rejected",
          description: "The verification request has been rejected.",
        })
      }

      await loadVerificationData()
    } catch (error) {
      console.error("[v0] Error processing verification:", error)
      toast({
        title: "Error",
        description: "Failed to process verification request",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  const handleRemoveVerification = async (userId: string) => {
    setProcessing(userId)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("profiles").update({ is_verified: false }).eq("id", userId)

      if (error) throw error

      toast({
        title: "Verification removed",
        description: "The user's verification has been removed.",
      })

      await loadVerificationData()
    } catch (error) {
      console.error("[v0] Error removing verification:", error)
      toast({
        title: "Error",
        description: "Failed to remove verification",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  const filteredRequests = requests.filter((r) => r.display_name.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredVerified = verifiedUsers.filter((r) => r.display_name.toLowerCase().includes(searchQuery.toLowerCase()))

  if (!isAdmin && !isLoading) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading verification management...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Verification Management</h1>
          <p className="text-muted-foreground">Review and approve verification requests</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pending Requests</CardTitle>
              <CardDescription>Users waiting for verification approval</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-amber-500/20 text-amber-600 dark:text-amber-400">
              {filteredRequests.length} pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No pending verification requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {request.display_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{request.display_name}</p>
                      <Badge variant="outline" className="text-xs">
                        <User className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                    {request.verification_requested_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Requested{" "}
                        {formatDistanceToNow(new Date(request.verification_requested_at), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleVerify(request.id, "approve")}
                      disabled={processing === request.id}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVerify(request.id, "reject")}
                      disabled={processing === request.id}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verified Users */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Verified Users</CardTitle>
              <CardDescription>Users with active verification badges</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-600 dark:text-blue-400">
              {filteredVerified.length} verified
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {filteredVerified.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No verified users yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredVerified.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.display_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{user.display_name}</p>
                      <Badge className="text-xs bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveVerification(user.id)}
                    disabled={processing === user.id}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
