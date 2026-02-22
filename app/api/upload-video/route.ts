import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Verify admin access
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    console.log('[v0] Uploading video to Vercel Blob:', file.name, 'Size:', file.size)

    // Upload to Vercel Blob (no file size limit)
    const blob = await put(`scenarios/${Date.now()}_${file.name}`, file, {
      access: 'public',
      contentType: file.type || 'video/mp4',
    })

    console.log('[v0] Video uploaded successfully:', blob.url)

    return NextResponse.json({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      contentType: blob.contentType,
      size: file.size,
    })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    const errorMsg = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json(
      { error: `Upload failed: ${errorMsg}` },
      { status: 500 }
    )
  }
}

// Increase the body size limit for video uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '500mb',
    },
  },
}
