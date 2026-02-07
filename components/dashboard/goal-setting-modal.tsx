"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Target, Zap, Flame, Sparkles, Ban } from "lucide-react"

interface GoalSettingModalProps {
  isOpen: boolean
  onClose: () => void
  onGoalSet: (scenarioGoal: number | null, quizGoal: number | null) => void
  currentScenarioGoal?: number | null
  currentQuizGoal?: number | null
  isEditing?: boolean
}

const presets = [
  {
    id: "none",
    name: "No Goal",
    icon: Ban,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/20",
    scenarios: null,
    quizzes: null,
    description: "Skip daily goal",
  },
  {
    id: "light",
    name: "Light",
    icon: Target,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    scenarios: 1,
    quizzes: 0,
    description: "Busy days",
  },
  {
    id: "moderate",
    name: "Moderate",
    icon: Zap,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    scenarios: 2,
    quizzes: 1,
    description: "Balanced",
  },
  {
    id: "intensive",
    name: "Intensive",
    icon: Flame,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    scenarios: 3,
    quizzes: 2,
    description: "Maximum",
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
  const [customScenarios, setCustomScenarios] = useState(currentScenarioGoal ?? 2)
  const [customQuizzes, setCustomQuizzes] = useState(currentQuizGoal ?? 1)
  const [isCustom, setIsCustom] = useState(false)
  const [saving, setSaving] = useState(false)

  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId)
    setIsCustom(false)
  }

  const handleCustomSelect = () => {
    setIsCustom(true)
    setSelectedPreset(null)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      let scenarioGoal: number | null = customScenarios
      let quizGoal: number | null = customQuizzes

      if (selectedPreset && !isCustom) {
        const preset = presets.find((p) => p.id === selectedPreset)
        if (preset) {
          scenarioGoal = preset.scenarios
          quizGoal = preset.quizzes
        }
      }

      const isNoGoal = selectedPreset === "none"

      // Update profile
      const { error } = await supabase
        .from("profiles")
        .update({
          daily_scenario_goal: isNoGoal ? null : scenarioGoal,
          daily_quiz_goal: isNoGoal ? null : quizGoal,
          has_set_goals: true,
        })
        .eq("id", user.id)

      if (!error) {
        onGoalSet(isNoGoal ? null : scenarioGoal, isNoGoal ? null : quizGoal)
        onClose()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg sm:text-xl">
            {isEditing ? "Update Daily Goal" : "Set Daily Training Goal"}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {isEditing ? "Adjust your daily targets" : "Choose your daily goal or skip for now"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => {
              const Icon = preset.icon
              const isSelected = selectedPreset === preset.id && !isCustom

              return (
                <Card
                  key={preset.id}
                  className={`cursor-pointer transition-all hover:scale-[1.02] ${
                    isSelected ? `border-2 ${preset.borderColor} ${preset.bgColor}` : "border border-border"
                  }`}
                  onClick={() => handlePresetSelect(preset.id)}
                >
                  <CardContent className="p-2 sm:p-3 text-center space-y-1">
                    <div
                      className={`h-8 w-8 sm:h-10 sm:w-10 mx-auto rounded-lg ${preset.bgColor} flex items-center justify-center`}
                    >
                      <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${preset.color}`} />
                    </div>
                    <h3 className="font-semibold text-sm">{preset.name}</h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">{preset.description}</p>
                    {preset.scenarios !== null && (
                      <div className="text-[10px] sm:text-xs font-medium pt-1 space-y-0.5">
                        <div>{preset.scenarios} scenarios</div>
                        <div>{preset.quizzes} quizzes</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card
            className={`cursor-pointer transition-all ${
              isCustom ? "border-2 border-purple-500/50 bg-purple-500/10" : "border border-border"
            }`}
            onClick={handleCustomSelect}
          >
            <CardContent className="p-2 sm:p-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">Custom</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Set your own targets</p>
                </div>
              </div>

              {isCustom && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="space-y-1">
                    <Label htmlFor="scenarios" className="text-xs">
                      Scenarios
                    </Label>
                    <Input
                      id="scenarios"
                      type="number"
                      min="0"
                      max="20"
                      value={customScenarios ?? 0}
                      onChange={(e) => setCustomScenarios(Number.parseInt(e.target.value) || 0)}
                      className="text-center h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="quizzes" className="text-xs">
                      Quizzes
                    </Label>
                    <Input
                      id="quizzes"
                      type="number"
                      min="0"
                      max="20"
                      value={customQuizzes ?? 0}
                      onChange={(e) => setCustomQuizzes(Number.parseInt(e.target.value) || 0)}
                      className="text-center h-8 text-sm"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <Button variant="outline" size="sm" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!selectedPreset && !isCustom}
            className={saving ? "opacity-50" : ""}
          >
            {saving ? "Saving..." : isEditing ? "Update" : "Set Goal"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
