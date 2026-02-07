"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { ArrowLeft, Shield, User, TrendingUp, Award, Search, ShieldCheck, ShieldOff, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { CustomModal } from "@/components/custom-modal"

interface UserProfile {
  id: string
  display_name: string | null
  experience_level: string | null
  total_points: number
  current_streak: number
  last_activity_date: string | null
  created_at: string
  is_admin: boolean
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [userToTerminate, setUserToTerminate] = useState<UserProfile | null>(null)
  const router = useRouter()

  const [modal, setModal] = useState({
    isOpen: false,
    type: "info" as "success" | "error" | "warning" | "info" | "confirm",
    title: "",
    message: "",
    onConfirm: () => {},
  })

  useEffect(() => {
    const fetchUsers = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setCurrentUserId(user.id)

      const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

      if (!profile?.is_admin) {
        router.push("/dashboard")
        return
      }

      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

      if (data) {
        setUsers(data)
        setFilteredUsers(data)
      }

      setIsLoading(false)
    }

    fetchUsers()
  }, [router])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      setFilteredUsers(
        users.filter(
          (user) =>
            user.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.id.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    }
  }, [searchQuery, users])

  const toggleAdmin = async (userId: string, currentIsAdmin: boolean) => {
    if (userId === currentUserId && currentIsAdmin) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Cannot Remove Own Admin",
        message: "You cannot remove your own admin privileges.",
      })
      return
    }

    const supabase = createClient()
    const { error } = await supabase.from("profiles").update({ is_admin: !currentIsAdmin }).eq("id", userId)

    if (error) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to update admin status.",
      })
      return
    }

    setUsers(users.map((u) => (u.id === userId ? { ...u, is_admin: !currentIsAdmin } : u)))
    setModal({
      isOpen: true,
      type: "success",
      title: "Success",
      message: `User ${!currentIsAdmin ? "granted" : "removed"} admin privileges.`,
    })
  }

  const terminateAccount = async (user: UserProfile) => {
    if (user.id === currentUserId) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Cannot Terminate Own Account",
        message: "You cannot terminate your own account.",
        onConfirm: () => {},
      })
      return
    }

    if (user.is_admin) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Cannot Terminate Admin",
        message: "Remove admin privileges before terminating this account.",
        onConfirm: () => {},
      })
      return
    }

    setUserToTerminate(user)
    setModal({
      isOpen: true,
      type: "confirm",
      title: "Terminate Account",
      message: `Are you sure you want to permanently terminate the account for "${user.display_name || "Anonymous User"}"? This action cannot be undone and will delete all their data.`,
      onConfirm: async () => {
        try {
          const response = await fetch("/api/admin/terminate-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id }),
          })

          if (!response.ok) {
            throw new Error("Failed to terminate account")
          }

          setUsers(users.filter((u) => u.id !== user.id))
          setModal({
            isOpen: true,
            type: "success",
            title: "Account Terminated",
            message: "The user account has been permanently deleted.",
            onConfirm: () => {},
          })
        } catch (error) {
          setModal({
            isOpen: true,
            type: "error",
            title: "Error",
            message: "Failed to terminate account. Please try again.",
            onConfirm: () => {},
          })
        }
        setUserToTerminate(null)
      },
    })
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
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>All Users ({users.length})</CardTitle>
              <CardDescription>View user profiles, activity, and manage admin roles</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading users...</p>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-medium">{user.display_name || "Anonymous User"}</h3>
                        <Badge variant="outline" className="text-xs">
                          {user.experience_level || "beginner"}
                        </Badge>
                        {user.is_admin && (
                          <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Joined {new Date(user.created_at).toLocaleDateString()} •{" "}
                        {user.last_activity_date
                          ? `Last active ${new Date(user.last_activity_date).toLocaleDateString()}`
                          : "Never active"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-6">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Award className="h-4 w-4" />
                          <span className="font-semibold">{user.total_points}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Points</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-orange-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="font-semibold">{user.current_streak}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Streak</p>
                      </div>
                    </div>
                    <Button
                      variant={user.is_admin ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => toggleAdmin(user.id, user.is_admin)}
                      className="cursor-pointer"
                    >
                      {user.is_admin ? (
                        <>
                          <ShieldOff className="h-4 w-4 mr-1" />
                          Remove Admin
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4 mr-1" />
                          Make Admin
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => terminateAccount(user)}
                      className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                      disabled={user.id === currentUserId || user.is_admin}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && <p className="text-center text-muted-foreground py-8">No users found.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
