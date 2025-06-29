import { StatCard } from "../../components/admin/StatCard"
import { Users, Brush, CalendarDays, FolderKanban, AlertCircle, CheckCircle2, TrendingUp, Mail, Activity, UserPlus } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs"
import { Button } from "../../components/ui/button"
import { RecentActivityItem } from "../../components/admin/RecentActivityItem"
import { QuickAction } from "../../components/admin/QuickAction"
import { useFetchStats } from "../../hooks/use-fetch-stats"
import { useFetchRecentActivity } from "../../hooks/use-fetch-recent-activity"
import { Skeleton } from "../../components/ui/skeleton"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"

export default function AdminDashboard() {
  const { stats, loading: statsLoading } = useFetchStats()
  const { activities, loading: activitiesLoading } = useFetchRecentActivity()
  
  // Sample data for the chart
  const performanceData = [
    { name: 'Jan', users: 20, artworks: 45 },
    { name: 'Feb', users: 35, artworks: 62 },
    { name: 'Mar', users: 28, artworks: 51 },
    { name: 'Apr', users: 42, artworks: 78 },
    { name: 'May', users: 50, artworks: 90 },
    { name: 'Jun', users: 38, artworks: 65 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back, Administrator. Here's what's happening with your platform.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Send Announcement
          </Button>
          <Button>
            <Activity className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <QuickAction 
          title="Approve Artwork" 
          icon={<CheckCircle2 className="text-green-500" />} 
          href="/admin/approvals"
        />
        <QuickAction 
          title="Manage Events" 
          icon={<CalendarDays className="text-blue-500" />} 
          href="/admin/events"
        />
        <QuickAction 
          title="Add Member" 
          icon={<UserPlus className="text-purple-500" />} 
          href="/admin/members/new"
        />
        <QuickAction 
          title="Create Project" 
          icon={<FolderKanban className="text-orange-500" />} 
          href="/admin/projects/new"
        />
        <QuickAction 
          title="View Reports" 
          icon={<TrendingUp className="text-amber-500" />} 
          href="/admin/reports"
        />
        <QuickAction 
          title="Pending Tasks" 
          icon={<AlertCircle className="text-red-500" />} 
          href="/admin/tasks"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          <>
            <Skeleton className="h-[120px] w-full rounded-xl" />
            <Skeleton className="h-[120px] w-full rounded-xl" />
            <Skeleton className="h-[120px] w-full rounded-xl" />
            <Skeleton className="h-[120px] w-full rounded-xl" />
          </>
        ) : (
          <>
            <StatCard 
              title="Total Members" 
              value={stats?.totalMembers || 0} 
              change={stats?.memberChange || 0}
              icon={<Users className="text-muted-foreground" />} 
            />
            <StatCard 
              title="Artworks Submitted" 
              value={stats?.totalArtworks || 0} 
              change={stats?.artworkChange || 0}
              icon={<Brush className="text-muted-foreground" />} 
            />
            <StatCard 
              title="Upcoming Events" 
              value={stats?.upcomingEvents || 0} 
              icon={<CalendarDays className="text-muted-foreground" />} 
            />
            <StatCard 
              title="Active Projects" 
              value={stats?.activeProjects || 0} 
              icon={<FolderKanban className="text-muted-foreground" />} 
            />
          </>
        )}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent Activity */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {activitiesLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : activities.length > 0 ? (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <RecentActivityItem 
                        key={activity.id}
                        type={activity.type}
                        title={activity.title}
                        user={activity.user}
                        timestamp={activity.timestamp}
                        status={activity.status}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No recent activity
                  </div>
                )}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm">API Services</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Operational</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm">Database</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Normal</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm">Storage</span>
                    </div>
                    <span className="text-sm text-muted-foreground">64% used</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm">Last Backup</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Today, 02:00 AM</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Pending Actions</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Artwork Approvals</span>
                      <span className="font-medium">{stats?.pendingApprovals || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Member Requests</span>
                      <span className="font-medium">{stats?.pendingMembers || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Reported Content</span>
                      <span className="font-medium">{stats?.reportedContent || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Platform Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="users" fill="#3b82f6" name="New Users" />
                      <Bar dataKey="artworks" fill="#10b981" name="Artworks" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Activity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Mon', value: 120 },
                      { name: 'Tue', value: 200 },
                      { name: 'Wed', value: 150 },
                      { name: 'Thu', value: 180 },
                      { name: 'Fri', value: 220 },
                      { name: 'Sat', value: 190 },
                      { name: 'Sun', value: 140 },
                    ]}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8b5cf6" name="Active Users" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Full Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              {activitiesLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <RecentActivityItem 
                      key={activity.id}
                      type={activity.type}
                      title={activity.title}
                      user={activity.user}
                      timestamp={activity.timestamp}
                      status={activity.status}
                      fullWidth
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No activity logged
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}