import { redirect } from "next/navigation"

// Clerk handles email verification in its own UI
export default function SignUpSuccessPage() {
  redirect("/dashboard")
}
