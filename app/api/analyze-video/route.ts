import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const runtime = 'nodejs'
export const maxDuration = 60

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

    console.log('[v0] Starting video analysis:', videoUrl)

    // Step 1: Use Gemini to analyze the video and describe what happens
    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const geminiPrompt = `You are analyzing a football/soccer referee training video. 
    
Please watch this video carefully and provide a detailed description of what happens:
- What is the match situation?
- What incident occurs?
- Who is involved (attackers, defenders, referee position)?
- What are the key visual details?
- What happens immediately before and after the incident?

Provide a clear, objective description in 3-4 sentences.`

    console.log('[v0] Calling Gemini for video description...')

    const geminiResult = await model.generateContent([
      {
        fileData: {
          mimeType: 'video/mp4',
          fileUri: videoUrl
        }
      },
      { text: geminiPrompt }
    ])

    const videoDescription = geminiResult.response.text()
    console.log('[v0] Gemini video description:', videoDescription)

    // Step 2: Use GPT-4 to analyze the scenario based on the description
    const refAnalysisPrompt = `You are an expert football/soccer referee instructor. Based on the following video description, provide a comprehensive refereeing analysis:

VIDEO DESCRIPTION:
${videoDescription}

Please provide:
1. **Scenario Title**: A brief title (5-7 words)
2. **Correct Decision**: What is the correct refereeing decision according to the Laws of the Game?
3. **Law References**: Which specific Law(s) of the Game apply? (e.g., "Law 12: Fouls and Misconduct")
4. **Key Factors**: What are 3-4 key factors a referee should consider in this situation?
5. **Common Mistakes**: What are 2-3 mistakes referees commonly make in this type of scenario?
6. **Difficulty Level**: Rate this scenario as easy, medium, hard, or expert

Format your response as JSON with this structure:
{
  "title": "brief scenario title",
  "description": "the video description provided above",
  "correctDecision": "the correct call",
  "lawReferences": ["Law X: ...", "Law Y: ..."],
  "keyFactors": ["factor 1", "factor 2", "factor 3"],
  "commonMistakes": ["mistake 1", "mistake 2"],
  "difficulty": "medium"
}`

    console.log('[v0] Calling GPT-4 for refereeing analysis...')

    const gptResponse = await fetch('https://gateway.ai.cloudflare.com/v1/vercel/default/openai/chat/completions', {
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
            content: refAnalysisPrompt
          }
        ],
        response_format: { type: 'json_object' }
      })
    })

    if (!gptResponse.ok) {
      const errorText = await gptResponse.text()
      console.error('[v0] GPT-4 error:', errorText)
      return NextResponse.json({ error: 'Failed to analyze scenario with GPT-4' }, { status: 500 })
    }

    const gptData = await gptResponse.json()
    const analysis = JSON.parse(gptData.choices[0].message.content)

    console.log('[v0] Analysis complete:', analysis)

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('[v0] Error in video analysis:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 })
  }
}
