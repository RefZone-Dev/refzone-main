import { requireAuth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { checkFeatureClosure } from "@/lib/feature-closures"
import { FeatureClosure } from "@/components/ui/feature-closure"
import DecisionLabClient from "./decision-lab-client"

export default async function DecisionLabPage() {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    redirect("/auth/login")
  }

  // Check if decision lab is closed
  const closure = await checkFeatureClosure('decision_lab')
  if (closure) {
    return <FeatureClosure closure={closure} />
  }

  return <DecisionLabClient />
}
