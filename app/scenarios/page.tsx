import { requireAuth } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { redirect } from "next/navigation"
import { ScenarioAutoPlayer } from "@/components/scenario-auto-player"
import { checkFeatureClosure } from "@/lib/feature-closures"
import { FeatureClosure } from "@/components/ui/feature-closure"

export default async function ScenariosPage() {
  let userId: string
  try {
    userId = await requireAuth()
  } catch {
    redirect("/auth/login")
  }
  const supabase = createServiceClient()

  // Check if scenarios are closed
  const closure = await checkFeatureClosure('scenarios')
  if (closure) {
    return <FeatureClosure closure={closure} />
  }

  // Fetch all data in parallel
  const [profileResult, scenariosResult, completedResult] = await Promise.all([
    supabase.from("profiles").select("scenario_streak, longest_scenario_streak").eq("id", userId).single(),
    supabase.from("scenarios").select("*").eq("is_active", true),
    supabase.from("scenario_responses").select("scenario_id").eq("user_id", userId),
  ])

  const profile = profileResult.data
  const scenarios = scenariosResult.data
  const completedScenarios = completedResult.data

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
      userId={userId}
      initialStreak={profile?.scenario_streak || 0}
      longestStreak={profile?.longest_scenario_streak || 0}
      totalUnseen={unseenScenarios.length}
    />
  )
}
