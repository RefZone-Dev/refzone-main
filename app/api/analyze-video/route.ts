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

    // Call AI to analyze the video
    const analysisPrompt = `You are an expert football/soccer referee analyzing a match scenario video. 
    
Please provide a comprehensive analysis of this refereeing scenario including:

1. **Situation Description**: Describe what happens in the video in detail (2-3 sentences)
2. **Correct Decision**: What is the correct refereeing decision according to the Laws of the Game?
3. **Law References**: Which specific Law(s) of the Game apply?
4. **Key Factors**: What are the key factors a referee should consider?
5. **Common Mistakes**: What mistakes do referees commonly make in this situation?

Format your response as JSON with the following structure:
{
  "description": "detailed description of the scenario",
  "correctDecision": "the correct call",
  "lawReferences": ["Law X: ...", "Law Y: ..."],
  "keyFactors": ["factor 1", "factor 2", ...],
  "commonMistakes": ["mistake 1", "mistake 2", ...],
  "difficulty": "easy|medium|hard|expert"
}`

    const response = await fetch('https://gateway.ai.cloudflare.com/v1/vercel/default/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY || process.env.AI_GATEWAY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: analysisPrompt
              },
              {
                type: 'video_url',
                video_url: {
                  url: videoUrl
                }
              }
            ]
          }
        ],
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('[v0] AI analysis error:', errorData)
      return NextResponse.json({ error: 'Failed to analyze video' }, { status: 500 })
    }

    const data = await response.json()
    const analysis = JSON.parse(data.choices[0].message.content)

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('[v0] Error in video analysis:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
