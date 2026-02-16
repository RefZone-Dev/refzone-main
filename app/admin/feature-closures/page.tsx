"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { PageLoader } from "@/components/ui/page-loader"
import { AlertCircle, CheckCircle2, Save } from "lucide-react"
import type { FeatureKey, FeatureClosure } from "@/lib/feature-closures-types"
import { FEATURE_NAMES, FEATURE_PATHS } from "@/lib/feature-closures-types"

const FEATURE_KEYS: FeatureKey[] = ['quizzes', 'scenarios', 'forum', 'decision_lab', 'reports', 'profile']

export default function FeatureClosuresPage() {
  const [closures, setClosures] = useState<Record<string, FeatureClosure>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    loadClosures()
  }, [])

  const loadClosures = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('feature_closures')
        .select('*')
        .order('feature_key')

      if (error) throw error

      const closuresMap: Record<string, FeatureClosure> = {}
      data?.forEach(closure => {
        closuresMap[closure.feature_key] = closure as FeatureClosure
      })
      
      setClosures(closuresMap)
    } catch (error) {
      console.error('Error loading closures:', error)
      setMessage({ type: 'error', text: 'Failed to load feature closures' })
    } finally {
      setIsLoading(false)
    }
  }

  const updateClosure = async (featureKey: FeatureKey, updates: Partial<FeatureClosure>) => {
    setIsSaving(featureKey)
    setMessage(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Not authenticated')

      const now = new Date().toISOString()
      const updateData: any = {
        ...updates,
        updated_at: now,
      }

      // If closing the feature, set closed_by and closed_at
      if (updates.is_closed) {
        updateData.closed_by = user.id
        updateData.closed_at = now
      }

      const { error } = await supabase
        .from('feature_closures')
        .update(updateData)
        .eq('feature_key', featureKey)

      if (error) throw error

      // Update local state
      setClosures(prev => ({
        ...prev,
        [featureKey]: {
          ...prev[featureKey],
          ...updateData
        }
      }))

      setMessage({ type: 'success', text: `${FEATURE_NAMES[featureKey]} updated successfully` })
    } catch (error) {
      console.error('Error updating closure:', error)
      setMessage({ type: 'error', text: 'Failed to update feature closure' })
    } finally {
      setIsSaving(null)
    }
  }

  if (isLoading) {
    return <PageLoader message="Loading feature closures..." />
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Feature Closures</h1>
        <p className="text-muted-foreground">
          Temporarily close features with custom messages and recommendations for users
        </p>
      </div>

      {message && (
        <Card className={`mb-6 ${message.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <p className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                {message.text}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {FEATURE_KEYS.map(featureKey => {
          const closure = closures[featureKey]
          if (!closure) return null

          return (
            <Card key={featureKey}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{FEATURE_NAMES[featureKey]}</CardTitle>
                    <CardDescription>{FEATURE_PATHS[featureKey]}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`${featureKey}-switch`} className="text-sm font-medium">
                      {closure.is_closed ? 'Closed' : 'Open'}
                    </Label>
                    <Switch
                      id={`${featureKey}-switch`}
                      checked={closure.is_closed}
                      onCheckedChange={(checked) => {
                        updateClosure(featureKey, { is_closed: checked })
                      }}
                      disabled={isSaving === featureKey}
                    />
                  </div>
                </div>
              </CardHeader>

              {closure.is_closed && (
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${featureKey}-message`}>Message to Users</Label>
                    <Textarea
                      id={`${featureKey}-message`}
                      placeholder="Explain why this feature is temporarily closed..."
                      value={closure.message || ''}
                      onChange={(e) => {
                        setClosures(prev => ({
                          ...prev,
                          [featureKey]: {
                            ...prev[featureKey],
                            message: e.target.value
                          }
                        }))
                      }}
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${featureKey}-rec-feature`}>Recommend Another Feature</Label>
                      <Select
                        value={closure.recommendation_feature_key || 'none'}
                        onValueChange={(value) => {
                          setClosures(prev => ({
                            ...prev,
                            [featureKey]: {
                              ...prev[featureKey],
                              recommendation_feature_key: value === 'none' ? null : value,
                              recommendation_url: value === 'none' ? null : prev[featureKey].recommendation_url
                            }
                          }))
                        }}
                      >
                        <SelectTrigger id={`${featureKey}-rec-feature`}>
                          <SelectValue placeholder="Select a feature..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {FEATURE_KEYS.filter(k => k !== featureKey).map(key => (
                            <SelectItem key={key} value={key}>
                              {FEATURE_NAMES[key]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${featureKey}-rec-url`}>Or Custom URL</Label>
                      <Input
                        id={`${featureKey}-rec-url`}
                        placeholder="/custom-page or https://..."
                        value={closure.recommendation_url || ''}
                        onChange={(e) => {
                          setClosures(prev => ({
                            ...prev,
                            [featureKey]: {
                              ...prev[featureKey],
                              recommendation_url: e.target.value || null,
                              recommendation_feature_key: null
                            }
                          }))
                        }}
                        disabled={!!closure.recommendation_feature_key}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${featureKey}-rec-text`}>Button Text (optional)</Label>
                    <Input
                      id={`${featureKey}-rec-text`}
                      placeholder="e.g., Try Scenarios Instead"
                      value={closure.recommendation_text || ''}
                      onChange={(e) => {
                        setClosures(prev => ({
                          ...prev,
                          [featureKey]: {
                            ...prev[featureKey],
                            recommendation_text: e.target.value || null
                          }
                        }))
                      }}
                    />
                  </div>

                  <Button
                    onClick={() => updateClosure(featureKey, {
                      message: closure.message,
                      recommendation_text: closure.recommendation_text,
                      recommendation_url: closure.recommendation_url,
                      recommendation_feature_key: closure.recommendation_feature_key
                    })}
                    disabled={isSaving === featureKey}
                    className="w-full sm:w-auto"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving === featureKey ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
