"use server"

import { put } from "@vercel/blob"

interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

export async function uploadVideoToBlob(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get("video") as File | null
    
    if (!file) {
      return { success: false, error: "No file provided" }
    }

    if (!file.type.startsWith("video/")) {
      return { success: false, error: "File must be a video" }
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      return { success: false, error: "Video file must be less than 100MB" }
    }

    console.log("[v0] Uploading video:", file.name, file.size)

    const blob = await put(`scenarios/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    console.log("[v0] Upload successful:", blob.url)

    return { success: true, url: blob.url }
  } catch (error) {
    console.error("[v0] Upload error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to upload video"
    return { 
      success: false, 
      error: errorMessage
    }
  }
}
