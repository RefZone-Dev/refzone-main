"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { PageLoader } from "@/components/ui/page-loader"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Info } from "lucide-react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [dobDay, setDobDay] = useState("")
  const [dobMonth, setDobMonth] = useState("")
  const [dobYear, setDobYear] = useState("")
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)
  const months = [
    { value: "01", label: "January" }, { value: "02", label: "February" },
    { value: "03", label: "March" }, { value: "04", label: "April" },
    { value: "05", label: "May" }, { value: "06", label: "June" },
    { value: "07", label: "July" }, { value: "08", label: "August" },
    { value: "09", label: "September" }, { value: "10", label: "October" },
    { value: "11", label: "November" }, { value: "12", label: "December" },
  ]
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"))

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreedToTerms) {
      setError("You must agree to the Terms and Conditions to create an account.")
      return
    }

    if (!agreedToPrivacy) {
      setError("You must agree to the Privacy Policy to create an account.")
      return
    }

    if (!dobDay || !dobMonth || !dobYear) {
      setError("Please enter your date of birth.")
      return
    }

    const dateOfBirth = `${dobYear}-${dobMonth}-${dobDay}`
    const dob = new Date(dateOfBirth)
    if (Number.isNaN(dob.getTime())) {
      setError("Please enter a valid date of birth.")
      return
    }

    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data: existingUsername } = await supabase
        .from("profiles")
        .select("id")
        .ilike("display_name", username)
        .maybeSingle()

      if (existingUsername) {
        setError("This username is already taken. Please choose a different one.")
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${typeof window !== "undefined" ? window.location.origin : ""}/dashboard`,
          data: {
            display_name: username,
            date_of_birth: dateOfBirth,
            privacy_agreed: true,
            privacy_agreed_at: new Date().toISOString(),
          },
        },
      })

      if (error) {
        if (error.message.includes("User already registered") || error.message.includes("already been registered")) {
          setError("This email is already associated with an account. Please sign in instead.")
        } else if (error.message.includes("Invalid email")) {
          setError("Please enter a valid email address.")
        } else if (error.message.includes("Password")) {
          setError("Password must be at least 6 characters long.")
        } else {
          setError(error.message)
        }
        setIsLoading(false)
        return
      }

      // Update profile with DOB and privacy consent
      if (data.user) {
        await supabase
          .from("profiles")
          .update({
            date_of_birth: dateOfBirth,
            privacy_agreed: true,
            privacy_agreed_at: new Date().toISOString(),
          })
          .eq("id", data.user.id)
      }

      if (data.user && !data.user.confirmed_at) {
        router.push("/auth/sign-up-success")
      } else {
        router.push("/dashboard")
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred. Please try again."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <PageLoader message="Creating account" />
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
          <p className="text-gray-600 dark:text-gray-400">Start your referee training journey</p>
        </div>
        <Card className="border-2 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Join thousands of referees improving their skills</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                    minLength={3}
                  />
                  <p className="text-xs text-muted-foreground">This is how other referees will see you</p>
                </div>
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
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">At least 6 characters</p>
                </div>

                {/* Date of Birth */}
                <div className="grid gap-2">
                  <Label>Date of Birth</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Select value={dobDay} onValueChange={setDobDay}>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map((d) => (
                          <SelectItem key={d} value={d} className="cursor-pointer">{Number.parseInt(d)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={dobMonth} onValueChange={setDobMonth}>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((m) => (
                          <SelectItem key={m.value} value={m.value} className="cursor-pointer">{m.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={dobYear} onValueChange={setDobYear}>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((y) => (
                          <SelectItem key={y} value={String(y)} className="cursor-pointer">{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-start gap-2 mt-1 p-2.5 rounded-md bg-muted/50 border border-border">
                    <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      We collect your date of birth to comply with Australian law, including the Online Safety Amendment (Social Media Minimum Age) Act 2024. Users under 16 have restricted access to certain social features.
                    </p>
                  </div>
                </div>

                {/* Terms and Conditions Agreement */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground leading-tight cursor-pointer"
                  >
                    {"I agree to the "}
                    <Link href="/terms" className="text-primary hover:underline" target="_blank">
                      Terms and Conditions
                    </Link>
                    .
                  </label>
                </div>

                {/* Privacy Policy Agreement */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={agreedToPrivacy}
                    onCheckedChange={(checked) => setAgreedToPrivacy(checked === true)}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor="privacy"
                    className="text-sm text-muted-foreground leading-tight cursor-pointer"
                  >
                    {"I agree to the "}
                    <Link href="/privacy" className="text-primary hover:underline" target="_blank">
                      Privacy Policy
                    </Link>
                    {", and confirm I am 16+ or have parental consent. I'm happy to receive updates and exclusive offers from RefZone and our industry partners."}
                  </label>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}
                <Button type="submit" className="w-full cursor-pointer" disabled={isLoading || !agreedToPrivacy || !agreedToTerms}>
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>

                <div className="mt-6 text-center text-sm">
                  {"Already have an account? "}
                  <Link
                    href="/auth/login"
                    className="font-medium text-primary hover:text-primary/80 underline underline-offset-4"
                  >
                    Sign in
                  </Link>
                </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
