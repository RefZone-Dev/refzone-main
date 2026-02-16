import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ScenarioAutoPlayer } from "@/components/scenario-auto-player"
import { checkFeatureClosure } from "@/lib/feature-closures"
import { FeatureClosure } from "@/components/ui/feature-closure"

export default async function ScenariosPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Check if scenarios are closed
  const closure = await checkFeatureClosure('scenarios')
  if (closure) {
    return <FeatureClosure closure={closure} />
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("scenario_streak, longest_scenario_streak")
    .eq("id", user.id)
    .single()

  const { data: scenarios } = await supabase.from("scenarios").select("*").eq("is_active", true)

  const { data: completedScenarios } = await supabase
    .from("scenario_responses")
    .select("scenario_id")
    .eq("user_id", user.id)

  const completedIds = new Set(completedScenarios?.map((s) => s.scenario_id) || [])

  const unseenScenarios = scenarios?.filter((s) => !completedIds.has(s.id)) || []

  // Shuffle array using Fisher-Yates algorithm
  for (let i = unseenScenarios.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[unseenScenarios[i], unseenScenarios[j]] = [unseenScenarios[j], unseenScenarios[i]]
  }

  const firstScenario = unseenScenarios[0] || null

  return (
    <ScenarioAutoPlayer
      initialScenario={firstScenario}
      userId={user.id}
      initialStreak={profile?.scenario_streak || 0}
      longestStreak={profile?.longest_scenario_streak || 0}
      totalUnseen={unseenScenarios.length}
    />
  )
}
