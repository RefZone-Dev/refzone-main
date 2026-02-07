import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ScenarioPlayer } from "@/components/scenario-player"

export default async function ScenarioDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch scenario details
  const { data: scenario } = await supabase.from("scenarios").select("*").eq("id", id).single()

  if (!scenario) {
    redirect("/scenarios")
  }

  return <ScenarioPlayer scenario={scenario} userId={user.id} />
}
