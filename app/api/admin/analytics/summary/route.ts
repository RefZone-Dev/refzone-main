import { requireAdmin } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/service'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const adminUserId = await requireAdmin()

    const supabase = createServiceClient()

    // Get overall statistics
    const [
      { count: totalUsers },
      { count: totalActions },
      { data: todayActive },
      { data: weekActive },
      { data: monthActive },
      { data: recentActivity },
      { data: featureUsage },
      { data: topUsers },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('user_activity_log').select('*', { count: 'exact', head: true }),
      supabase
        .from('user_activity_log')
        .select('user_id')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .then(res => ({ data: new Set(res.data?.map(d => d.user_id)).size })),
      supabase
        .from('user_activity_log')
        .select('user_id')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .then(res => ({ data: new Set(res.data?.map(d => d.user_id)).size })),
      supabase
        .from('user_activity_log')
        .select('user_id')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .then(res => ({ data: new Set(res.data?.map(d => d.user_id)).size })),
      supabase
        .from('user_activity_log')
        .select('id, user_id, action_type, created_at, profiles!inner(display_name)')
        .order('created_at', { ascending: false })
        .limit(50),
      supabase.rpc('get_feature_usage_stats'),
      supabase.rpc('get_top_active_users', { limit_count: 10 }),
    ])

    // Get hourly activity for heatmap (last 7 days)
    const { data: hourlyActivity } = await supabase
      .from('user_activity_log')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    // Process hourly data
    const heatmapData = Array.from({ length: 7 }, (_, day) => 
      Array.from({ length: 24 }, (_, hour) => ({ day, hour, count: 0 }))
    ).flat()

    hourlyActivity?.forEach(activity => {
      const date = new Date(activity.created_at)
      const dayOfWeek = date.getDay()
      const hour = date.getHours()
      const index = dayOfWeek * 24 + hour
      if (heatmapData[index]) {
        heatmapData[index].count++
      }
    })

    // Get growth data (last 30 days)
    const { data: dailyUsers } = await supabase
      .from('profiles')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true })

    // Process daily growth
    const growthData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      const count = dailyUsers?.filter(u => 
        u.created_at.startsWith(dateStr)
      ).length || 0
      return { date: dateStr, count }
    })

    return NextResponse.json({
      summary: {
        totalUsers: totalUsers || 0,
        totalActions: totalActions || 0,
        activeToday: todayActive || 0,
        activeThisWeek: weekActive || 0,
        activeThisMonth: monthActive || 0,
      },
      recentActivity: recentActivity || [],
      featureUsage: featureUsage || [],
      topUsers: topUsers || [],
      heatmapData,
      growthData,
    })
  } catch (error) {
    console.error('[v0] Analytics summary error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
