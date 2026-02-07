"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Target, Zap, Flame, Settings2, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface GoalSettingModalProps {
  isOpen: boolean
  onClose: () => void
  onGoalSet: (scenarioGoal: number, quizGoal: number) => void
  currentScenarioGoal?: number
  currentQuizGoal?: number
  isEditing?: boolean
}

const presetGoals = [
  {
    id: "light",
    name: "Light Training",
    icon: Target,
    scenarios: 1,
    quizzes: 0,
    description: "Perfect for busy days",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 hover:bg-blue-500/20",
  },
  {
    id: "moderate",
    name: "Moderate Training",
    icon: Zap,
    scenarios: 2,
    quizzes: 1,
    description: "Balanced daily practice",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10 hover:bg-amber-500/20",
  },
  {
    id: "intensive",
    name: "Intensive Training",
    icon: Flame,
    scenarios: 3,
    quizzes: 2,
    description: "For serious improvement",
    color: "text-red-500",
    bgColor: "bg-red-500/10 hover:bg-red-500/20",
  },
  {
    id: "custom",
    name: "Custom Goal",
    icon: Settings2,
    scenarios: 0,
    quizzes: 0,
    description: "Set your own targets",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10 hover:bg-purple-500/20",
  },
]

export function GoalSettingModal({
  isOpen,
  onClose,
  onGoalSet,
  currentScenarioGoal = 2,
  currentQuizGoal = 1,
  isEditing = false,
}: GoalSettingModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [customScenarios, setCustomScenarios] = useState(currentScenarioGoal)
  const [customQuizzes, setCustomQuizzes] = useState(currentQuizGoal)
  const [isLoading, setIsLoading] = useState(false)

  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId)
    if (presetId !== "custom") {
      const preset = presetGoals.find((p) => p.id === presetId)
      if (preset) {
        setCustomScenarios(preset.scenarios)
        setCustomQuizzes(preset.quizzes)
      }
    }
  }

  const handleSaveGoal = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        await supabase
          .from("profiles")
          .update({
            daily_scenario_goal: customScenarios,
            daily_quiz_goal: customQuizzes,
            has_set_goals: true,
          })
          .eq("id", user.id)

        onGoalSet(customScenarios, customQuizzes)
        onClose()
      }
    } catch (error) {
      console.error("Error saving goal:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            {isEditing ? "Change Your Daily Goal" : "Set Your Daily Training Goal"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Adjust your daily training targets"
              : "Welcome to RefZone! Choose how much you want to train each day. You can always do more - this is just your daily target."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            {presetGoals.map((preset) => {
              const Icon = preset.icon
              const isSelected = selectedPreset === preset.id
              return (
                <Card
                  key={preset.id}
                  className={`cursor-pointer transition-all border-2 ${
                    isSelected ? "border-primary ring-2 ring-primary/20" : "border-transparent"
                  } ${preset.bgColor}`}
                  onClick={() => handlePresetSelect(preset.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <Icon className={`h-6 w-6 ${preset.color}`} />
                      {isSelected && <Check className="h-5 w-5 text-primary" />}
                    </div>
                    <h3 className="font-semibold mt-2 text-foreground">{preset.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{preset.description}</p>
                    {preset.id !== "custom" && (
                      <p className="text-sm font-medium mt-2 text-foreground">
                        {preset.scenarios} scenario{preset.scenarios !== 1 ? "s" : ""}, {preset.quizzes} quiz
                        {preset.quizzes !== 1 ? "zes" : ""}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {selectedPreset === "custom" && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-scenarios">Daily Scenarios</Label>
                  <Input
                    id="custom-scenarios"
                    type="number"
                    min={0}
                    max={20}
                    value={customScenarios}
                    onChange={(e) => setCustomScenarios(Math.max(0, Number.parseInt(e.target.value) || 0))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-quizzes">Daily Quizzes</Label>
                  <Input
                    id="custom-quizzes"
                    type="number"
                    min={0}
                    max={10}
                    value={customQuizzes}
                    onChange={(e) => setCustomQuizzes(Math.max(0, Number.parseInt(e.target.value) || 0))}
                  />
                </div>
              </div>
            </div>
          )}

          {selectedPreset && selectedPreset !== "custom" && (
            <div className="text-center text-sm text-muted-foreground py-2">
              Your daily goal:{" "}
              <span className="font-semibold text-foreground">
                {customScenarios} scenario{customScenarios !== 1 ? "s" : ""} and {customQuizzes} quiz
                {customQuizzes !== 1 ? "zes" : ""}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          {isEditing && (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSaveGoal} disabled={!selectedPreset || isLoading}>
            {isLoading ? "Saving..." : isEditing ? "Update Goal" : "Start Training"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
