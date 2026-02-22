import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const filename = request.headers.get('x-vercel-filename') || `video-${Date.now()}.mp4`
    const contentType = request.headers.get('content-type') || 'video/mp4'

    // Stream the request body directly to Vercel Blob
    // This uses multipart upload under the hood for large files
    const blob = await put(filename, request.body!, {
      access: 'public',
      contentType,
      multipart: true,
    })

    return NextResponse.json({
      url: blob.url,
      filename: blob.pathname,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 },
    )
  }
}
