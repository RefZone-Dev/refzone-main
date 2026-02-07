"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Bell, UserPlus, MessageSquare, Trophy, Check, X, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link?: string
  is_read: boolean
  created_at: string
  related_friendship_id?: string
  related_user_id?: string
  profiles?: {
    display_name: string
  }
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [tableExists, setTableExists] = useState(true)
  const [respondingTo, setRespondingTo] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadNotifications()

    if (!tableExists) return

    const supabase = createClient()
    const channel = supabase
      .channel("notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
        setNotifications((prev) => [payload.new as Notification, ...prev])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [tableExists])

  const loadNotifications = async () => {
    try {
      const supabase = createClient()
      let user = null
      try {
        const { data } = await supabase.auth.getSession()
        user = data?.session?.user
      } catch (authError) {
        console.warn("[v0] Auth fetch failed, skipping notifications load")
        setLoading(false)
        return
      }

      if (!user) {
        setLoading(false)
        return
      }

      const { data: notificationsData, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20)

      if (error) {
        if (error.code === "PGRST205" || error.message?.includes("Could not find the table")) {
          setTableExists(false)
          setNotifications([])
        }
        setLoading(false)
        return
      }

      // Batch fetch all related profiles in one query instead of N+1
      const relatedUserIds = [...new Set(
        (notificationsData || []).map((n) => n.related_user_id).filter(Boolean)
      )]

      let profileMap = new Map()
      if (relatedUserIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name")
          .in("id", relatedUserIds)
        profiles?.forEach((p) => profileMap.set(p.id, { display_name: p.display_name }))
      }

      const notificationsWithProfiles = (notificationsData || []).map((notification) => ({
        ...notification,
        profiles: notification.related_user_id ? profileMap.get(notification.related_user_id) || undefined : undefined,
      }))

      setNotifications(notificationsWithProfiles)
    } catch (error) {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const supabase = createClient()
      await supabase.from("notifications").update({ is_read: true }).eq("id", id)

      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
    } catch (error) {
      console.error("[v0] Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const supabase = createClient()
      let user = null
      try {
        const { data } = await supabase.auth.getSession()
        user = data?.session?.user
      } catch (authError) {
        return
      }

      if (!user) return

      await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false)

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    } catch (error) {
      console.error("[v0] Error marking all as read:", error)
    }
  }

  const respondToFriendRequest = async (notificationId: string, friendshipId: string, action: "accept" | "decline") => {
    setRespondingTo(notificationId)

    try {
      const response = await fetch("/api/friendships/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendshipId, action }),
      })

      if (!response.ok) {
        throw new Error("Failed to respond to friend request")
      }

      await markAsRead(notificationId)
      await loadNotifications()
    } catch (error) {
      console.error("[v0] Error responding to friend request:", error)
    } finally {
      setRespondingTo(null)
    }
  }

  const viewProfile = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/profile?user=${userId}`)
  }

  const handleClick = (notification: Notification) => {
    if (notification.type === "friend_request") return

    markAsRead(notification.id)
    if (notification.link) {
      router.push(notification.link)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "friend_request":
      case "friend_accepted":
        return <UserPlus className="h-4 w-4 text-blue-500" />
      case "friend_post":
      case "reply":
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case "achievement":
        return <Trophy className="h-4 w-4 text-amber-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-3 py-2">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No notifications yet</div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onClick={() => handleClick(notification)}
                className={`flex flex-col gap-2 p-3 ${notification.type === "friend_request" ? "cursor-default" : "cursor-pointer"} ${!notification.is_read ? "bg-primary/5" : ""}`}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="mt-0.5">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.is_read ? "font-medium" : ""}`}>{notification.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.is_read && notification.type !== "friend_request" && (
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                  )}
                </div>

                {(notification.type === "friend_request" || notification.type === "friend_accepted") &&
                  notification.related_user_id &&
                  notification.profiles && (
                    <div className="flex items-center gap-2 pl-7 w-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {notification.profiles.display_name?.charAt(0).toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{notification.profiles.display_name}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={(e) => viewProfile(notification.related_user_id!, e)}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}

                {notification.type === "friend_request" && notification.related_friendship_id && (
                  <div className="flex gap-2 pl-7 w-full" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="default"
                      className="flex-1 h-8 text-xs"
                      onClick={() =>
                        respondToFriendRequest(notification.id, notification.related_friendship_id!, "accept")
                      }
                      disabled={respondingTo === notification.id}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8 text-xs bg-transparent"
                      onClick={() =>
                        respondToFriendRequest(notification.id, notification.related_friendship_id!, "decline")
                      }
                      disabled={respondingTo === notification.id}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Decline
                    </Button>
                  </div>
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
