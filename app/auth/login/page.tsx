"use client"

import type React from "react"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageLoader } from "@/components/ui/page-loader"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Mail, AlertCircle } from "lucide-react"

function LoginContent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false)
  const [resendingEmail, setResendingEmail] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/dashboard"

  const getRedirectUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "")
    return `${baseUrl}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`
  }

  const handleGoogleSignIn = async () => {
    setSocialLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getRedirectUrl(),
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) {
        setError(error.message)
        setSocialLoading(false)
      }
      // If successful, user will be redirected
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to sign in with Google"
      setError(errorMessage)
      setSocialLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setEmailNotConfirmed(false)
    setResendSuccess(false)

    // Easter egg :)
    if (password === "123" && email.toLowerCase() === "refzone.office@gmail.com") {
      setError("I was just kidding :)")
      setIsLoading(false)
      return
    }
    if (password === "123") {
      setError('That password is incorrect but it is associated with the email "refzone.office@gmail.com", is this your account?')
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes("Email not confirmed") || error.message.includes("email_not_confirmed")) {
          setEmailNotConfirmed(true)
          setError("Your email address has not been confirmed yet.")
        } else if (error.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please check your credentials and try again.")
        } else {
          setError(error.message)
        }
        return
      }

      router.push(redirectTo)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    setResendingEmail(true)
    setResendSuccess(false)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || (typeof window !== "undefined" ? window.location.origin : ""),
        },
      })

      if (error) {
        setError(error.message)
      } else {
        setResendSuccess(true)
        setError(null)
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to resend email"
      setError(errorMessage)
    } finally {
      setResendingEmail(false)
    }
  }

  if (isLoading) {
    return <PageLoader message="Signing in" />
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">R</span>
            <span className="text-gray-900 dark:text-white">efZone</span>
            <span className="text-xs align-super text-gray-500 ml-0.5">&#174;</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Train like a pro referee</p>
        </div>
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to continue your training journey</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              className="w-full mb-4 bg-transparent"
              onClick={handleGoogleSignIn}
              disabled={socialLoading || isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {socialLoading ? "Signing in..." : "Continue with Google"}
            </Button>

            <div className="relative my-4">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                or
              </span>
            </div>

            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="referee@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {emailNotConfirmed && (
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 space-y-3">
                    <div className="flex gap-3">
                      <Mail className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-900">Email Not Confirmed</p>
                        <p className="text-xs text-amber-700 mt-1">
                          Please check your inbox (and spam folder) for a confirmation email, or click below to resend it.
                        </p>
                      </div>
                    </div>

                    {resendSuccess ? (
                      <div className="p-2 rounded bg-green-100 border border-green-200">
                        <p className="text-xs text-green-700 text-center">
                          Confirmation email sent! Check your inbox and spam folder.
                        </p>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        onClick={handleResendConfirmation}
                        disabled={resendingEmail}
                      >
                        {resendingEmail ? "Sending..." : "Resend Confirmation Email"}
                      </Button>
                    )}

                    <div className="p-2 rounded bg-blue-50 border border-blue-200">
                      <p className="text-xs text-blue-700">
                        <strong>Note:</strong> Email delivery can take a few minutes. If emails aren't arriving, they
                        may be blocked by your email provider. Contact support for assistance.
                      </p>
                    </div>
                  </div>
                )}

                {error && !emailNotConfirmed && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <div className="flex gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
              <div className="mt-6 text-center text-sm">
                {"Don't have an account? "}
                <Link
                  href="/auth/sign-up"
                  className="font-medium text-blue-600 hover:text-blue-700 underline underline-offset-4"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoader message="Loading login..." />}>
      <LoginContent />
    </Suspense>
  )
}
