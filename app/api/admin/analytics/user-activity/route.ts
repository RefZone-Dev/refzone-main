import { requireAdmin } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/service'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const adminUserId = await requireAdmin()

    const supabase = createServiceClient()

    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const actionType = searchParams.get('actionType')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('user_activity_log')
      .select(`
        *,
        profiles!inner(display_name, avatar_url)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (actionType) {
      query = query.eq('action_type', actionType)
    }

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      activities: data || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error('[v0] User activity error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user activity' },
      { status: 500 }
    )
  }
}
