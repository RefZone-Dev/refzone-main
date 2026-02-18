import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

// Chunk upload endpoint - handles individual chunks
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const chunk = formData.get('chunk') as Blob
    const chunkIndex = parseInt(formData.get('chunkIndex') as string)
    const totalChunks = parseInt(formData.get('totalChunks') as string)
    const filename = formData.get('filename') as string
    const uploadId = formData.get('uploadId') as string

    if (!chunk || !filename || !uploadId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Convert blob to buffer
    const arrayBuffer = await chunk.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Store chunk temporarily
    const chunkPath = `temp/${uploadId}/${chunkIndex}`
    const { error: chunkError } = await supabase.storage
      .from('uploads')
      .upload(chunkPath, buffer, {
        contentType: 'application/octet-stream',
        upsert: true,
      })

    if (chunkError) {
      console.error('Chunk upload error:', chunkError)
      return NextResponse.json(
        { error: 'Failed to upload chunk' },
        { status: 500 }
      )
    }

    // If this is the last chunk, assemble the file
    if (chunkIndex === totalChunks - 1) {
      try {
        // Download and assemble all chunks
        const chunks: Buffer[] = []
        for (let i = 0; i < totalChunks; i++) {
          const { data: chunkData, error: downloadError } = await supabase.storage
            .from('uploads')
            .download(`temp/${uploadId}/${i}`)
          
          if (downloadError || !chunkData) {
            throw new Error(`Failed to download chunk ${i}`)
          }
          
          const chunkBuffer = Buffer.from(await chunkData.arrayBuffer())
          chunks.push(chunkBuffer)
        }

        // Combine all chunks
        const finalBuffer = Buffer.concat(chunks)

        // Upload final file to scenarios bucket
        const filePath = `videos/${Date.now()}_${filename}`
        const { error: uploadError } = await supabase.storage
          .from('scenarios')
          .upload(filePath, finalBuffer, {
            contentType: 'video/mp4',
            cacheControl: '3600',
          })

        if (uploadError) {
          throw uploadError
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('scenarios')
          .getPublicUrl(filePath)

        // Clean up temp chunks
        for (let i = 0; i < totalChunks; i++) {
          await supabase.storage
            .from('uploads')
            .remove([`temp/${uploadId}/${i}`])
        }

        return NextResponse.json({
          complete: true,
          url: publicUrl,
          path: filePath,
        })
      } catch (assembleError) {
        console.error('File assembly error:', assembleError)
        return NextResponse.json(
          { error: 'Failed to assemble file' },
          { status: 500 }
        )
      }
    }

    // Return progress for non-final chunks
    return NextResponse.json({
      complete: false,
      chunkIndex,
      totalChunks,
      progress: Math.round(((chunkIndex + 1) / totalChunks) * 100),
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
