import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Verify admin access before generating an upload token
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          throw new Error('Unauthorized')
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()

        if (!profile?.is_admin) {
          throw new Error('Admin access required')
        }

        return {
          allowedContentTypes: [
            'video/mp4',
            'video/quicktime',
            'video/webm',
            'video/x-msvideo',
            'video/x-matroska',
          ],
          maximumSizeInBytes: 250 * 1024 * 1024, // 250MB
          tokenPayload: JSON.stringify({ userId: user.id }),
        }
      },
      onUploadCompleted: async () => {
        // No additional processing needed after upload
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 400 }
    )
  }
}
