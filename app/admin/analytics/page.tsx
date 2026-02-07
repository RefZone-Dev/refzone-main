import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalyticsCharts } from '@/components/admin/analytics-charts'
import { Activity, Users, TrendingUp, Clock, Trophy } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')

  // Fetch analytics data directly
  const [
    { count: totalUsers },
    { count: totalActions },
    { data: recentActivity },
    { data: topUsers },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('user_activity_log').select('*', { count: 'exact', head: true }),
    supabase
      .from('user_activity_log')
      .select(`
        id,
        action_type,
        created_at,
        action_details,
        profiles!inner(display_name, avatar_url)
      `)
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('profiles')
      .select('id, display_name, avatar_url, total_points, current_streak')
      .order('total_points', { ascending: false })
      .limit(10),
  ])

  // Get active users counts
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [
    { data: todayActiveData },
    { data: weekActiveData },
    { data: monthActiveData },
  ] = await Promise.all([
    supabase
      .from('user_activity_log')
      .select('user_id')
      .gte('created_at', oneDayAgo),
    supabase
      .from('user_activity_log')
      .select('user_id')
      .gte('created_at', oneWeekAgo),
    supabase
      .from('user_activity_log')
      .select('user_id')
      .gte('created_at', oneMonthAgo),
  ])

  const activeToday = new Set(todayActiveData?.map(d => d.user_id)).size
  const activeThisWeek = new Set(weekActiveData?.map(d => d.user_id)).size
  const activeThisMonth = new Set(monthActiveData?.map(d => d.user_id)).size

  // Get growth data (last 30 days)
  const { data: dailyUsers } = await supabase
    .from('profiles')
    .select('created_at')
    .gte('created_at', oneMonthAgo)
    .order('created_at', { ascending: true })

  const growthData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000)
    const dateStr = date.toISOString().split('T')[0]
    const count = dailyUsers?.filter(u => u.created_at.startsWith(dateStr)).length || 0
    return { date: dateStr, count }
  })

  // Get hourly activity for heatmap (last 7 days)
  const { data: hourlyActivity } = await supabase
    .from('user_activity_log')
    .select('created_at')
    .gte('created_at', oneWeekAgo)

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

  // Get feature usage
  const { data: featureUsageData } = await supabase
    .from('user_activity_log')
    .select('action_type')

  const featureUsageMap = new Map<string, number>()
  featureUsageData?.forEach(item => {
    const count = featureUsageMap.get(item.action_type) || 0
    featureUsageMap.set(item.action_type, count + 1)
  })

  const featureUsage = Array.from(featureUsageMap.entries()).map(([name, count]) => ({
    name: name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    count,
  }))

  const analytics = {
    summary: {
      totalUsers: totalUsers || 0,
      totalActions: totalActions || 0,
      activeToday,
      activeThisWeek,
      activeThisMonth,
    },
    growthData,
    featureUsage,
    heatmapData,
  }



  const formatActionType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into user behavior and platform performance
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.summary?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.summary?.activeToday || 0}</div>
            <p className="text-xs text-muted-foreground">Users active in last 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.summary?.activeThisWeek || 0}</div>
            <p className="text-xs text-muted-foreground">Users active in last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active This Month</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.summary?.activeThisMonth || 0}</div>
            <p className="text-xs text-muted-foreground">Users active in last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.summary?.totalActions || 0}</div>
            <p className="text-xs text-muted-foreground">All tracked activities</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <AnalyticsCharts
        growthData={analytics.growthData || []}
        featureUsage={analytics.featureUsage || []}
        heatmapData={analytics.heatmapData || []}
      />

      {/* Activity Feed and Top Users */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {recentActivity?.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {activity.profiles?.display_name || 'Unknown User'}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {formatActionType(activity.action_type)}
                        </Badge>
                      </div>
                      {activity.action_details && Object.keys(activity.action_details).length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {JSON.stringify(activity.action_details).substring(0, 60)}...
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {getTimeAgo(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Users by Points</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {topUsers?.map((user, index) => (
                  <div key={user.id} className="flex items-center gap-3 pb-4 border-b last:border-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{user.display_name}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{user.total_points} points</span>
                        <span>•</span>
                        <span>{user.current_streak} day streak</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {analytics.summary?.totalUsers || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {((analytics.summary?.activeThisWeek || 0) / (analytics.summary?.totalUsers || 1) * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Weekly Active Rate</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {Math.floor((analytics.summary?.totalActions || 0) / (analytics.summary?.totalUsers || 1))}
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Actions/User</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Daily Active Users</span>
                  <span className="font-bold">{analytics.summary?.activeToday || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Weekly Active Users</span>
                  <span className="font-bold">{analytics.summary?.activeThisWeek || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Monthly Active Users</span>
                  <span className="font-bold">{analytics.summary?.activeThisMonth || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Detailed performance metrics and user behavior analysis coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
