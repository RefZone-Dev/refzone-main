import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { videoUrl } = await request.json()

    if (!videoUrl) {
      return NextResponse.json({ error: 'Video URL is required' }, { status: 400 })
    }

    // Return a template for manual completion
    // Note: GPT-4 Vision doesn't support video analysis directly
    // Admin will need to watch the video and fill in the details
    const analysis = {
      description: "Watch the video and describe what happens in this refereeing scenario. What incident occurs? What should the referee observe?",
      correctDecision: "What is the correct call according to the Laws of the Game?",
      lawReferences: ["Law X: [Add relevant law]"],
      keyFactors: ["Key factor 1 to consider", "Key factor 2 to consider"],
      commonMistakes: ["Common mistake 1", "Common mistake 2"],
      difficulty: "medium"
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('[v0] Error in video analysis:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
