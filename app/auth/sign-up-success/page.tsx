import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, AlertCircle } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md">
        <Card className="border-2 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>We've sent you a confirmation link to verify your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                  1
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Check your email inbox for a message from RefZone
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                  2
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">Click the confirmation link in the email</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                  3
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">Return here to log in and start training</p>
              </div>
            </div>

            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-200">Can't Find the Email?</p>
                  <ul className="text-xs text-amber-800 dark:text-amber-300 space-y-1 list-disc list-inside">
                    <li>
                      Check your <strong>spam/junk folder</strong>
                    </li>
                    <li>Wait a few minutes - emails can be delayed</li>
                    <li>Try logging in - you can resend from there</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href="/auth/login">Go to Login</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
