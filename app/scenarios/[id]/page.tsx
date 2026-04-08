import { requireAuth } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { redirect } from "next/navigation"
import { ScenarioPlayer } from "@/components/scenario-player"

export default async function ScenarioDetailPage({ params }: { params: { id: string } }) {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    redirect("/auth/login")
  }
  const supabase = createServiceClient()
  const { id } = await params

  // Fetch scenario details
  const { data: scenario } = await supabase.from("scenarios").select("*").eq("id", id).single()

  if (!scenario) {
    redirect("/scenarios")
  }

  return <ScenarioPlayer scenario={scenario} userId={userId} />
}
