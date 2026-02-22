'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Mail, Trophy, Flame, Target, BookOpen } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface UserDetailsModalProps {
  userId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDetailsModal({ userId, open, onOpenChange }: UserDetailsModalProps) {
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userId && open) {
      fetchUserDetails()
    }
  }, [userId, open])

  const fetchUserDetails = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}/details`)
      if (!res.ok) {
        setUserData(null)
        return
      }
      const data = await res.json()
      setUserData(data)
    } catch (error) {
      console.error('Failed to fetch user details:', error)
      setUserData(null)
    } finally {
      setLoading(false)
    }
  }

  if (!userId) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">User Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : userData ? (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[60vh] mt-4">
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{userData.email || 'N/A'}</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {userData.is_admin && <Badge>Admin</Badge>}
                        <Badge variant="outline">{userData.experience_level || 'none'}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Joined: {userData.created_at ? new Date(userData.created_at).toLocaleDateString() : 'N/A'}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">Points</span>
                        </div>
                        <span className="font-semibold">{userData.total_points || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Flame className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">Current Streak</span>
                        </div>
                        <span className="font-semibold">{userData.current_streak || 0} days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Quizzes Completed</span>
                        </div>
                        <span className="font-semibold">{userData.quizzes_completed || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Scenarios Completed</span>
                        </div>
                        <span className="font-semibold">{userData.scenarios_completed || 0}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {userData.recentActivity?.length > 0 ? (
                          userData.recentActivity.map((activity: any, index: number) => (
                            <div key={index} className="flex justify-between items-start border-b pb-3">
                              <div>
                                <p className="font-medium text-sm">{activity.action_type}</p>
                                <p className="text-xs text-muted-foreground">{activity.details}</p>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(activity.created_at).toLocaleString()}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Quiz Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userData.quizPerformance && userData.quizPerformance.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={userData.quizPerformance}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="avgScore" fill="hsl(var(--primary))" name="Avg Score %" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">No performance data yet</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No data available</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
