import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('video') as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!file.type.startsWith('video/')) {
      return NextResponse.json(
        { success: false, error: 'File must be a video' },
        { status: 400 }
      )
    }

    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Video file must be less than 100MB' },
        { status: 400 }
      )
    }

    console.log('[v0] Uploading video:', file.name, file.size)

    const blob = await put(`scenarios/${Date.now()}-${file.name}`, file, {
      access: 'public',
    })

    console.log('[v0] Upload successful:', blob.url)

    return NextResponse.json({ success: true, url: blob.url })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload video',
      },
      { status: 500 }
    )
  }
}
