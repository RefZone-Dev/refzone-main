import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Allow video uploads with size limit of 500MB
        return {
          allowedContentTypes: [
            'video/mp4',
            'video/webm',
            'video/quicktime',
            'video/x-msvideo',
            'video/mpeg',
            'video/ogg',
            'video/x-matroska',
          ],
          maximumSizeInBytes: 500 * 1024 * 1024, // 500MB
          tokenPayload: JSON.stringify({
            pathname,
          }),
        }
      },
      onUploadCompleted: async ({ blob }) => {
        // This callback is called after the upload is complete
        // It runs on the server after Vercel Blob notifies us
        console.log('Video upload completed:', blob.url)
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 400 },
    )
  }
}
