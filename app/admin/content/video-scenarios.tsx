"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { upload } from "@vercel/blob/client"

export function VideoScenarioUpload({ onSuccess }: { onSuccess: () => void }) {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [nextNumber, setNextNumber] = useState(1)
  const [answer, setAnswer] = useState("")

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
      if (file.size > 100 * 1024 * 1024) {
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
      const blob = await upload(videoFile.name, videoFile, {
        access: "public",
        handleUploadUrl: "/api/upload-video",
        multipart: true,
      })

      setVideoUrl(blob.url)
    } catch (err) {
      console.error("Video upload error:", err)
      setError(err instanceof Error ? err.message : "Failed to upload video.")
    } finally {
      setIsUploading(false)
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
        difficulty: "medium",
        scenario_type: "foul",
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
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter the correct answer for this scenario..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  AI will compare user answers against this to provide feedback.
                </p>
              </div>

              <Button
                onClick={saveScenario}
                disabled={isSaving || !answer.trim()}
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
