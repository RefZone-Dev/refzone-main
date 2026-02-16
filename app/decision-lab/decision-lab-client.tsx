import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { checkFeatureClosure } from "@/lib/feature-closures"
import { FeatureClosure } from "@/components/ui/feature-closure"
import DecisionLabClient from "./decision-lab-client"

export default async function DecisionLabPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  // Check if decision lab is closed
  const closure = await checkFeatureClosure('decision_lab')
  if (closure) {
    return <FeatureClosure closure={closure} />
  }

  return <DecisionLabClient />
}
