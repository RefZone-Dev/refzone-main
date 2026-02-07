import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient()
    const serviceClient = createServiceClient()

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userId = params.id

    // Get user profile
    const { data: userProfile } = await serviceClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    // Get user auth data
    const { data: authUser } = await serviceClient.auth.admin.getUserById(userId)

    // Get recent activity (last 50 actions)
    const { data: recentActivity } = await serviceClient
      .from('user_activity_log')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    // Get full timeline (last 200 actions)
    const { data: fullTimeline } = await serviceClient
      .from('user_activity_log')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(200)

    // Get quiz performance
    const { data: quizResults } = await serviceClient
      .from('quiz_results')
      .select('*, quizzes(category)')
      .eq('user_id', userId)

    const quizPerformance = quizResults?.reduce((acc: any[], result: any) => {
      const category = result.quizzes?.category || 'Unknown'
      const existing = acc.find((item) => item.category === category)
      if (existing) {
        existing.total += result.score
        existing.count += 1
        existing.avgScore = Math.round((existing.total / existing.count) * 100)
      } else {
        acc.push({
          category,
          total: result.score,
          count: 1,
          avgScore: Math.round(result.score * 100),
        })
      }
      return acc
    }, [])

    // Get action distribution
    const actionCounts = recentActivity?.reduce((acc: any, activity: any) => {
      acc[activity.action_type] = (acc[activity.action_type] || 0) + 1
      return acc
    }, {})

    const actionDistribution = Object.entries(actionCounts || {}).map(([name, value]) => ({
      name,
      value,
    }))

    // Get performance data (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: performanceResults } = await serviceClient
      .from('quiz_results')
      .select('score, created_at')
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true })

    const performanceData = performanceResults?.map((result) => ({
      date: new Date(result.created_at).toLocaleDateString(),
      score: Math.round(result.score * 100),
    }))

    // Get engagement data (last 30 days)
    const { data: engagementResults } = await serviceClient
      .from('user_activity_log')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo.toISOString())

    const engagementByDay = engagementResults?.reduce((acc: any, activity: any) => {
      const date = new Date(activity.created_at).toLocaleDateString()
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    const engagementData = Object.entries(engagementByDay || {}).map(([date, actions]) => ({
      date,
      actions,
    }))

    // Count forum posts
    const { count: forumPostsCount } = await serviceClient
      .from('forum_posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // Count scenarios completed
    const { count: scenariosCount } = await serviceClient
      .from('scenario_results')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // Calculate session stats
    const totalActions = recentActivity?.length || 0
    const totalSessions = new Set(recentActivity?.map((a) => a.session_id)).size
    const avgSessionDuration = recentActivity?.reduce((acc, a) => acc + (a.duration_seconds || 0), 0) / totalSessions || 0

    return NextResponse.json({
      ...userProfile,
      email: authUser?.user?.email,
      recentActivity: recentActivity?.map((a) => ({
        action_type: a.action_type,
        details: a.action_details,
        created_at: a.created_at,
      })),
      fullTimeline,
      quizPerformance,
      actionDistribution,
      performanceData,
      engagementData,
      forum_posts: forumPostsCount,
      scenarios_completed: scenariosCount,
      quizzes_completed: quizResults?.length || 0,
      totalActions,
      totalSessions,
      avgSessionDuration: Math.round(avgSessionDuration / 60), // Convert to minutes
    })
  } catch (error) {
    console.error('Error fetching user details:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
