import { put } from '@vercel/blob'
import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'video/mp4',
      'video/quicktime',
      'video/webm',
      'video/x-msvideo',
      'video/x-matroska',
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Please upload a video file.' }, { status: 400 })
    }

    // Validate file size (250MB)
    if (file.size > 250 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 250MB.' }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(`videos/${file.name}`, file, {
      access: 'public',
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('Upload handler error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
