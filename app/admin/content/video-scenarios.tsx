"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, Loader2, CheckCircle2, XCircle, Sparkles } from "lucide-react"

export function VideoScenarioUpload({ onSuccess }: { onSuccess: () => void }) {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isGeneratingTags, setIsGeneratingTags] = useState(false)
  const [error, setError] = useState("")
  const [nextNumber, setNextNumber] = useState(1)
  const [answer, setAnswer] = useState("")
  
  // AI-suggested tags
  const [suggestedLawCategory, setSuggestedLawCategory] = useState("")
  const [suggestedLawSection, setSuggestedLawSection] = useState("")
  const [suggestedScenarioType, setSuggestedScenarioType] = useState("foul")
  const [suggestedDifficulty, setSuggestedDifficulty] = useState("medium")
  const [tagsGenerated, setTagsGenerated] = useState(false)

  useEffect(() => {
    async function getNextNumber() {
      const supabase = createClient()
      const { count } = await supabase
        .from("scenarios")
        .select("*", { count: "exact", head: true })
      setNextNumber((count || 0) + 1)
    }
    getNextNumber()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("video/")) {
        setError("Please select a video file")
        return
      }
      if (file.size > 250 * 1024 * 1024) {
        setError("Video file must be less than 250MB")
        return
      }
      setVideoFile(file)
      setError("")
    }
  }

  const uploadVideo = async () => {
    if (!videoFile) return

    setIsUploading(true)
    setError("")

    try {
      // First verify admin access via lightweight API check
      const authRes = await fetch('/api/upload-video', { method: 'POST' })
      if (!authRes.ok) {
        const authData = await authRes.json().catch(() => ({}))
        throw new Error(authData.error || 'Not authorized to upload')
      }

      // Upload directly from browser to Supabase Storage
      const supabase = createClient()
      const fileExt = videoFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `scenarios/${fileName}`

      const { data, error: uploadError } = await supabase.storage
        .from('scenario-videos')
        .upload(filePath, videoFile, {
          contentType: videoFile.type,
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('scenario-videos')
        .getPublicUrl(data.path)

      setVideoUrl(publicUrl)
    } catch (err) {
      console.error("Video upload error:", err)
      setError(err instanceof Error ? err.message : "Failed to upload video.")
    } finally {
      setIsUploading(false)
    }
  }

  const generateTags = async () => {
    if (!answer.trim()) {
      setError("Please enter an answer first")
      return
    }

    setIsGeneratingTags(true)
    setError("")

    try {
      const response = await fetch("/api/suggest-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: answer.trim() })
      })

      if (!response.ok) {
        throw new Error("Failed to generate tags")
      }

      const { tags } = await response.json()
      
      setSuggestedLawCategory(tags.lawCategory || "")
      setSuggestedLawSection(tags.lawSection || "")
      setSuggestedScenarioType(tags.scenarioType || "foul")
      setSuggestedDifficulty(tags.difficulty || "medium")
      setTagsGenerated(true)
    } catch (err) {
      console.error("Tag generation error:", err)
      setError("Failed to generate tags. You can still enter them manually.")
      // Still show the manual entry form even if generation fails
      setTagsGenerated(true)
    } finally {
      setIsGeneratingTags(false)
    }
  }

  const saveScenario = async () => {
    if (!videoUrl) {
      setError("Please upload a video first")
      return
    }
    if (!answer.trim()) {
      setError("Please provide the correct answer")
      return
    }

    setIsSaving(true)
    setError("")

    try {
      const supabase = createClient()

      const { error: insertError } = await supabase.from("scenarios").insert({
        title: `Scenario #${nextNumber}`,
        video_url: videoUrl,
        ai_answer: answer.trim(),
        law_category: suggestedLawCategory || null,
        law_section: suggestedLawSection || null,
        scenario_type: suggestedScenarioType,
        difficulty: suggestedDifficulty,
        is_active: true,
        points_value: 10,
      })

      if (insertError) throw insertError

      onSuccess()
    } catch (err) {
      console.error("Save scenario error:", err)
      setError("Failed to save scenario. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-5">
          {/* Title Preview */}
          <div className="p-3 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">This scenario will be saved as</p>
            <p className="text-lg font-bold">Scenario #{nextNumber}</p>
          </div>

          {/* Video Upload */}
          <div className="space-y-2">
            <Label htmlFor="video-upload">Upload Video</Label>
            <div className="flex gap-2">
              <Input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <Button
                onClick={uploadVideo}
                disabled={!videoFile || isUploading || !!videoUrl}
                className="whitespace-nowrap"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : videoUrl ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Uploaded
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
            {videoFile && !videoUrl && (
              <p className="text-sm text-muted-foreground">
                Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Video Preview */}
          {videoUrl && (
            <div className="space-y-2">
              <Label>Video Preview</Label>
              <video
                src={videoUrl}
                controls
                className="w-full rounded-lg border max-h-64"
              />
            </div>
          )}

          {/* Answer field - shown after video upload */}
          {videoUrl && (
            <>
              <div className="space-y-2">
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value)
                    setTagsGenerated(false) // Reset tags when answer changes
                  }}
                  placeholder="Enter the correct answer for this scenario..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  AI will compare user answers against this to provide feedback.
                </p>
              </div>

              {/* Generate Tags Button */}
              {!tagsGenerated && (
                <div className="flex gap-2">
                  <Button
                    onClick={generateTags}
                    disabled={isGeneratingTags || !answer.trim()}
                    variant="outline"
                    className="flex-1"
                  >
                    {isGeneratingTags ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Tags...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Tags with AI
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setTagsGenerated(true)}
                    disabled={!answer.trim()}
                    variant="secondary"
                  >
                    Enter Manually
                  </Button>
                </div>
              )}

              {/* Tag Review/Edit Section */}
              {tagsGenerated && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-500 text-white">Tags</Badge>
                      <p className="text-sm text-muted-foreground">Review and edit tags before saving</p>
                    </div>
                    <Button
                      onClick={generateTags}
                      disabled={isGeneratingTags}
                      variant="ghost"
                      size="sm"
                    >
                      {isGeneratingTags ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3 mr-1" />
                          Regenerate
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="law-category">Law Category</Label>
                      <Input
                        id="law-category"
                        value={suggestedLawCategory}
                        onChange={(e) => setSuggestedLawCategory(e.target.value)}
                        placeholder="e.g., Law 12: Fouls and Misconduct"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="law-section">Law Section</Label>
                      <Input
                        id="law-section"
                        value={suggestedLawSection}
                        onChange={(e) => setSuggestedLawSection(e.target.value)}
                        placeholder="e.g., Direct Free Kick"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scenario-type">Scenario Type</Label>
                      <Select value={suggestedScenarioType} onValueChange={setSuggestedScenarioType}>
                        <SelectTrigger id="scenario-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="foul">Foul</SelectItem>
                          <SelectItem value="offside">Offside</SelectItem>
                          <SelectItem value="handball">Handball</SelectItem>
                          <SelectItem value="misconduct">Misconduct</SelectItem>
                          <SelectItem value="advantage">Advantage</SelectItem>
                          <SelectItem value="penalty">Penalty</SelectItem>
                          <SelectItem value="var">VAR</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select value={suggestedDifficulty} onValueChange={setSuggestedDifficulty}>
                        <SelectTrigger id="difficulty">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              {tagsGenerated && (
                <Button
                  onClick={saveScenario}
                  disabled={isSaving}
                  className="w-full"
                  size="lg"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Save Scenario #{nextNumber}
                    </>
                  )}
                </Button>
              )}
            </>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <XCircle className="h-5 w-5 text-red-500 shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
