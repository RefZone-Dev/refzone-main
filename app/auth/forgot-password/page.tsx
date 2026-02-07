"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        setError(error.message)
      } else {
        setSent(true)
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
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
        </div>
        <Card className="border-2 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>
              {sent
                ? "Check your email for a reset link"
                : "Enter your email and we'll send you a link to reset your password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    {"We've sent a password reset link to:"}
                  </p>
                  <p className="font-medium text-foreground">{email}</p>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {"Didn't receive the email? Check your spam folder or try again."}
                </p>
                <div className="flex gap-3 w-full">
                  <Button
                    variant="outline"
                    className="flex-1 cursor-pointer bg-transparent"
                    onClick={() => { setSent(false); setEmail("") }}
                  >
                    Try again
                  </Button>
                  <Button asChild className="flex-1 cursor-pointer">
                    <Link href="/auth/login">Back to login</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="referee@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>

                  <Button variant="ghost" asChild className="w-full cursor-pointer">
                    <Link href="/auth/login">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to login
                    </Link>
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
