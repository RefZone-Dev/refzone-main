'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CheckCircle2, XCircle, Mail, Phone, Calendar, Trophy, Flame, Target, MessageSquare, BookOpen } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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
      const data = await res.json()
      setUserData(data)
    } catch (error) {
      console.error('Failed to fetch user details:', error)
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
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
                        <span className="text-sm">{userData.email}</span>
                      </div>
                      {userData.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{userData.phone}</span>
                          {userData.phone_verified ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      )}
                      {userData.date_of_birth && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{new Date(userData.date_of_birth).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex gap-2 flex-wrap">
                        {userData.is_admin && <Badge>Admin</Badge>}
                        {userData.is_verified && <Badge variant="secondary">Verified</Badge>}
                        <Badge variant="outline">{userData.experience_level}</Badge>
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
                          <span className="text-sm">Streak</span>
                        </div>
                        <span className="font-semibold">{userData.streak_count || 0} days</span>
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-purple-500" />
                          <span className="text-sm">Forum Posts</span>
                        </div>
                        <span className="font-semibold">{userData.forum_posts || 0}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {userData.performanceData && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Performance Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={userData.performanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="score" stroke="#8884d8" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {userData.recentActivity?.map((activity: any, index: number) => (
                          <div key={index} className="flex justify-between items-start border-b pb-3">
                            <div>
                              <p className="font-medium text-sm">{activity.action_type}</p>
                              <p className="text-xs text-muted-foreground">{activity.details}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(activity.created_at).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Quiz Performance by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userData.quizPerformance && (
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={userData.quizPerformance}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="avgScore" fill="#8884d8" name="Avg Score %" />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Action Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userData.actionDistribution && (
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={userData.actionDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {userData.actionDistribution.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'][index % 5]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="engagement" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Total Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{userData.totalSessions || 0}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Avg Session Duration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{userData.avgSessionDuration || 0}m</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Total Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{userData.totalActions || 0}</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Engagement Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userData.engagementData && (
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={userData.engagementData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="actions" stroke="#8884d8" name="Daily Actions" />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Complete Activity Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[450px]">
                      <div className="space-y-2">
                        {userData.fullTimeline?.map((item: any, index: number) => (
                          <div key={index} className="flex gap-3 border-l-2 border-primary/20 pl-4 pb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">{item.action_type}</Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(item.created_at).toLocaleString()}
                                </span>
                              </div>
                              {item.action_details && (
                                <p className="text-sm mt-1 text-muted-foreground">
                                  {JSON.stringify(item.action_details)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
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
