"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Loader2, CheckCircle2, XCircle, Video } from "lucide-react"

interface VideoScenarioForm {
  title: string
  difficulty: string
  scenario_type: string
  law_category: string
  points_value: number
}

interface AIAnalysis {
  description: string
  correctDecision: string
  lawReferences: string[]
  keyFactors: string[]
  commonMistakes: string[]
  difficulty: string
}

export function VideoScenarioUpload({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState<VideoScenarioForm>({
    title: "",
    difficulty: "medium",
    scenario_type: "foul",
    law_category: "Law 12",
    points_value: 10,
  })
  
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
  const [error, setError] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("video/")) {
        setError("Please select a video file")
        return
      }
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        setError("Video file must be less than 100MB")
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
      console.log("[v0] Getting upload token...")
      const tokenResponse = await fetch("/api/upload-token")
      const { token } = await tokenResponse.json()

      if (!token) {
        throw new Error("Failed to get upload token")
      }

      console.log("[v0] Uploading video directly to Blob storage...")
      
      const formData = new FormData()
      formData.append("file", videoFile)

      const uploadResponse = await fetch(
        `https://blob.vercel-storage.com/upload?filename=${encodeURIComponent(videoFile.name)}`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`)
      }

      const uploadResult = await uploadResponse.json()
      console.log("[v0] Video uploaded successfully:", uploadResult.url)
      
      setVideoUrl(uploadResult.url)
      setIsUploading(false)
      
      // Automatically analyze after upload
      await analyzeVideo(uploadResult.url)
    } catch (err) {
      console.error("[v0] Video upload error:", err)
      setError(err instanceof Error ? err.message : "Failed to upload video. Please try again.")
      setIsUploading(false)
    }
  }

  const analyzeVideo = async (url: string) => {
    setIsAnalyzing(true)
    setError("")

    try {
      const response = await fetch("/api/analyze-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: url }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze video")
      }

      const data = await response.json()
      setAnalysis(data.analysis)
      
      // Update form with AI suggestions
      if (data.analysis.difficulty) {
        setForm(prev => ({ ...prev, difficulty: data.analysis.difficulty }))
      }
    } catch (err) {
      console.error("[v0] Video analysis error:", err)
      setError("Failed to analyze video. Please review and save manually.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const saveScenario = async () => {
    if (!videoUrl || !analysis) {
      setError("Please upload and analyze a video first")
      return
    }

    if (!form.title) {
      setError("Please enter a title")
      return
    }

    try {
      const supabase = createClient()

      const { error: insertError } = await supabase.from("scenarios").insert({
        title: form.title,
        description: analysis.description,
        difficulty: form.difficulty,
        scenario_type: form.scenario_type,
        law_category: form.law_category,
        points_value: form.points_value,
        video_url: videoUrl,
        correct_decision: analysis.correctDecision,
        explanation: analysis.lawReferences.join("\n\n"),
        key_factors: analysis.keyFactors,
        common_mistakes: analysis.commonMistakes,
        is_active: true,
      })

      if (insertError) throw insertError

      // Reset form
      setForm({
        title: "",
        difficulty: "medium",
        scenario_type: "foul",
        law_category: "Law 12",
        points_value: 10,
      })
      setVideoFile(null)
      setVideoUrl("")
      setAnalysis(null)
      
      onSuccess()
    } catch (err) {
      console.error("[v0] Save scenario error:", err)
      setError("Failed to save scenario. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Video Upload */}
            <div className="space-y-2">
              <Label htmlFor="video-upload">Upload Video</Label>
              <div className="flex gap-2">
                <Input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  disabled={isUploading || isAnalyzing}
                />
                <Button
                  onClick={uploadVideo}
                  disabled={!videoFile || isUploading || isAnalyzing}
                  className="whitespace-nowrap"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload & Analyze
                    </>
                  )}
                </Button>
              </div>
              {videoFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Analysis Status */}
            {isAnalyzing && (
              <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm font-medium">AI is analyzing the video scenario...</span>
              </div>
            )}

            {/* Analysis Results */}
            {analysis && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-medium">AI Analysis Complete</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Description</Label>
                    <p className="text-sm mt-1">{analysis.description}</p>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Correct Decision</Label>
                    <p className="text-sm mt-1 font-medium">{analysis.correctDecision}</p>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Law References</Label>
                    <div className="mt-1 space-y-1">
                      {analysis.lawReferences.map((ref, i) => (
                        <Badge key={i} variant="secondary" className="mr-2">
                          {ref}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Key Factors</Label>
                    <ul className="text-sm mt-1 space-y-1 list-disc list-inside">
                      {analysis.keyFactors.map((factor, i) => (
                        <li key={i}>{factor}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Common Mistakes</Label>
                    <ul className="text-sm mt-1 space-y-1 list-disc list-inside">
                      {analysis.commonMistakes.map((mistake, i) => (
                        <li key={i}>{mistake}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Video Preview */}
            {videoUrl && (
              <div className="space-y-2">
                <Label>Video Preview</Label>
                <video
                  src={videoUrl}
                  controls
                  className="w-full rounded-lg border max-h-96"
                />
              </div>
            )}

            {/* Scenario Details Form */}
            {analysis && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">Scenario Title *</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g., Reckless Tackle in the Penalty Area"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={form.difficulty}
                      onValueChange={(value) => setForm({ ...form, difficulty: value })}
                    >
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

                  <div className="space-y-2">
                    <Label htmlFor="scenario-type">Scenario Type</Label>
                    <Select
                      value={form.scenario_type}
                      onValueChange={(value) => setForm({ ...form, scenario_type: value })}
                    >
                      <SelectTrigger id="scenario-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="foul">Foul</SelectItem>
                        <SelectItem value="offside">Offside</SelectItem>
                        <SelectItem value="handball">Handball</SelectItem>
                        <SelectItem value="misconduct">Misconduct</SelectItem>
                        <SelectItem value="advantage">Advantage</SelectItem>
                        <SelectItem value="var">VAR</SelectItem>
                        <SelectItem value="penalty">Penalty</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="law-category">Law Category</Label>
                    <Input
                      id="law-category"
                      value={form.law_category}
                      onChange={(e) => setForm({ ...form, law_category: e.target.value })}
                      placeholder="e.g., Law 12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="points">Points Value</Label>
                    <Input
                      id="points"
                      type="number"
                      value={form.points_value}
                      onChange={(e) => setForm({ ...form, points_value: parseInt(e.target.value) || 10 })}
                      min="1"
                    />
                  </div>
                </div>

                <Button onClick={saveScenario} className="w-full" size="lg">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Save Scenario
                </Button>
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
