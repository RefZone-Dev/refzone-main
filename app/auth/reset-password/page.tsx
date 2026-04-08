import { redirect } from "next/navigation"

// Clerk handles password reset through its own UI
export default function ResetPasswordPage() {
  redirect("/auth/login")
}
