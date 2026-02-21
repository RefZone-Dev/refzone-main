"use client"

import React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageLoader } from "@/components/ui/page-loader"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle, XCircle, User } from "lucide-react"

export default function SetupUsernamePage() {
  const [username, setUsername] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Check if user already has a username set
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, has_set_username")
        .eq("id", user.id)
        .single()

      // If user already explicitly set a username, redirect to dashboard
      const displayName = profile?.display_name?.trim()
      const hasValidUsername = profile?.has_set_username && displayName && !displayName.includes("@")
      if (hasValidUsername) {
        router.replace("/dashboard")
        return
      }

      setUserId(user.id)
      setIsLoading(false)
    }

    checkUser()
  }, [router])

  // Check username availability with debounce
  useEffect(() => {
    if (!username || username.length < 3 || !userId) {
      setIsAvailable(null)
      return
    }

    setIsChecking(true)
    const timer = setTimeout(async () => {
      try {
        const response = await fetch("/api/user/check-display-name", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ displayName: username, currentUserId: userId }),
        })
        const data = await response.json()
        setIsAvailable(data.available)
      } catch (err) {
        console.error("Error checking username:", err)
        setIsAvailable(null)
      } finally {
        setIsChecking(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [username, userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || username.length < 3) {
      setError("Username must be at least 3 characters")
      return
    }

    if (isAvailable === false) {
      setError("This username is already taken")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ display_name: username, has_set_username: true })
        .eq("id", userId)

      if (updateError) throw updateError




      router.replace("/dashboard")
      router.replace("/dashboard")
    } catch (err) {
      console.error("Error setting username:", err)
      setError("Failed to set username. Please try again.")
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <PageLoader message="Loading..." />
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">R</span>
            <span className="text-gray-900 dark:text-white">efZone</span>
            <span className="text-xs align-super text-gray-500 ml-0.5">&#174;</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Almost there! Choose your username</p>
        </div>
        
        <Card className="border-2 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Choose Your Username</CardTitle>
                <CardDescription>This is how other referees will see you</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter a unique username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                      minLength={3}
                      maxLength={30}
                      className={
                        isAvailable === false
                          ? "border-red-500 pr-10"
                          : isAvailable === true
                          ? "border-green-500 pr-10"
                          : "pr-10"
                      }
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isChecking && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                      {!isChecking && isAvailable === true && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {!isChecking && isAvailable === false && (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  {username.length > 0 && username.length < 3 && (
                    <p className="text-sm text-muted-foreground">
                      Username must be at least 3 characters
                    </p>
                  )}
                  {isAvailable === false && (
                    <p className="text-sm text-red-500">This username is already taken</p>
                  )}
                  {isAvailable === true && (
                    <p className="text-sm text-green-500">Username is available!</p>
                  )}
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || isChecking || isAvailable !== true || username.length < 3}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
