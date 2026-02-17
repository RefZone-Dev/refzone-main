import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Lightweight admin check endpoint - actual upload happens client-side to Supabase Storage
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
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

    return NextResponse.json({ authorized: true })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Auth check failed' },
      { status: 500 }
    )
  }
}
