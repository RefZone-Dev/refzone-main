"use server"

import { put } from "@vercel/blob"

export async function uploadVideoToBlob(formData: FormData) {
  try {
    const file = formData.get("video") as File
    
    if (!file) {
      throw new Error("No file provided")
    }

    if (!file.type.startsWith("video/")) {
      throw new Error("File must be a video")
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      throw new Error("Video file must be less than 100MB")
    }

    const blob = await put(`scenarios/${Date.now()}-${file.name}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return { success: true, url: blob.url }
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to upload video" 
    }
  }
}
