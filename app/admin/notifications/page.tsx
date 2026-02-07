"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Send, CheckCircle, AlertCircle, Users, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [link, setLink] = useState("")
  const [isImportant, setIsImportant] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [sentCount, setSentCount] = useState(0)
  
  // Push notification state
  const [pushTitle, setPushTitle] = useState("")
  const [pushBody, setPushBody] = useState("")
  const [pushLoading, setPushLoading] = useState(false)
  const [pushSuccess, setPushSuccess] = useState(false)
  const [pushSentCount, setPushSentCount] = useState(0)
  
  const { toast } = useToast()

  const sendPushNotification = async () => {
    if (!pushTitle.trim() || !pushBody.trim()) {
      toast({
        title: "Error",
        description: "Please provide both a title and body for the push notification",
        variant: "destructive",
      })
      return
    }

    setPushLoading(true)
    setPushSuccess(false)

    try {
      const response = await fetch("/api/admin/send-push-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: pushTitle.trim(),
          body: pushBody.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to send push notification")
      }

      setPushSuccess(true)
      setPushSentCount(data.count || 0)
      toast({
        title: "Success!",
        description: `Push notification sent to ${data.count} devices`,
      })

      setTimeout(() => {
        setPushTitle("")
        setPushBody("")
        setPushSuccess(false)
        setPushSentCount(0)
      }, 5000)
    } catch (error) {
      console.error("Error sending push notification:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send push notification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setPushLoading(false)
    }
  }

  const sendGlobalNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please provide both a title and message",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setSuccess(false)

    try {
      const response = await fetch("/api/admin/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          link: link.trim() || null,
          isImportant,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to send notification")
      }

      setSuccess(true)
      setSentCount(data.count || 0)
      toast({
        title: "Success!",
        description: `${isImportant ? "Important announcement" : "Notification"} sent to ${data.count} users`,
      })

      setTimeout(() => {
        setTitle("")
        setMessage("")
        setLink("")
        setIsImportant(false)
        setSuccess(false)
        setSentCount(0)
      }, 5000)
    } catch (error) {
      console.error("Error sending notification:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send notification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Global Notifications</h1>
        <p className="text-muted-foreground">Send announcements and push notifications to all users</p>
      </div>

      <Tabs defaultValue="in-app" className="max-w-2xl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="in-app" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            In-App Notification
          </TabsTrigger>
          <TabsTrigger value="push" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Push Notification
          </TabsTrigger>
        </TabsList>

        <TabsContent value="in-app">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Create In-App Notification
              </CardTitle>
              <CardDescription>This notification will appear in the app for all registered users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Notification Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., New Feature Announcement"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your announcement message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Link (Optional)</Label>
                <Input
                  id="link"
                  placeholder="/scenarios or https://example.com"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">Optionally provide a link users can click to learn more</p>
              </div>

              <div className="flex items-start space-x-3 rounded-lg border p-4 bg-orange-50 dark:bg-orange-950/20">
                <Checkbox
                  id="important"
                  checked={isImportant}
                  onCheckedChange={(checked) => setIsImportant(checked === true)}
                  disabled={loading}
                />
                <div className="space-y-1">
                  <label
                    htmlFor="important"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    Mark as Important Announcement
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Important announcements will appear as a full-screen modal when users next open the app
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={sendGlobalNotification}
                  disabled={loading || !title.trim() || !message.trim()}
                  className="gap-2"
                >
                  {success ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Sent Successfully!
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {loading ? "Sending..." : "Send to All Users"}
                    </>
                  )}
                </Button>
                {!success && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTitle("")
                      setMessage("")
                      setLink("")
                      setIsImportant(false)
                    }}
                    disabled={loading}
                  >
                    Clear
                  </Button>
                )}
              </div>

              {success && (
                <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="font-medium text-green-800 dark:text-green-200">Notification Sent Successfully!</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                    <Users className="h-4 w-4" />
                    <span>
                      Delivered to {sentCount} user{sentCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {isImportant && (
                    <p className="text-sm text-green-700 dark:text-green-300">
                      This important announcement will appear as a full-screen modal for all users.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="push">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Send Push Notification
              </CardTitle>
              <CardDescription>
                Send a push notification to all users who have enabled notifications on their devices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pushTitle">Notification Title</Label>
                <Input
                  id="pushTitle"
                  placeholder="e.g., New Quiz Available!"
                  value={pushTitle}
                  onChange={(e) => setPushTitle(e.target.value)}
                  disabled={pushLoading}
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground">Max 50 characters for best display on devices</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pushBody">Notification Body</Label>
                <Textarea
                  id="pushBody"
                  placeholder="A brief message that will appear in the notification..."
                  value={pushBody}
                  onChange={(e) => setPushBody(e.target.value)}
                  rows={3}
                  disabled={pushLoading}
                  maxLength={150}
                />
                <p className="text-xs text-muted-foreground">Max 150 characters. Keep it short and actionable.</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={sendPushNotification}
                  disabled={pushLoading || !pushTitle.trim() || !pushBody.trim()}
                  className="gap-2"
                >
                  {pushSuccess ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Sent Successfully!
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {pushLoading ? "Sending..." : "Send Push Notification"}
                    </>
                  )}
                </Button>
                {!pushSuccess && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPushTitle("")
                      setPushBody("")
                    }}
                    disabled={pushLoading}
                  >
                    Clear
                  </Button>
                )}
              </div>

              {pushSuccess && (
                <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="font-medium text-green-800 dark:text-green-200">Push Notification Sent!</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                    <Smartphone className="h-4 w-4" />
                    <span>
                      Delivered to {pushSentCount} device{pushSentCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
