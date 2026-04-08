import { redirect } from "next/navigation"

// Username setup is handled via the profile/settings page after Clerk signup
export default function SetupUsernamePage() {
  redirect("/settings")
}
