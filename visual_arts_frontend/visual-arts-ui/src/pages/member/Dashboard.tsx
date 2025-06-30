import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useMemberStats } from "../../hooks/use-member-stats";
import { Card, CardHeader, CardContent, CardTitle } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { Button } from "../../components/ui/button";
import { FiImage, FiCalendar, FiUpload, FiFile } from "react-icons/fi";
import { Progress } from "../../components/ui/progress";
import { Chart, registerables } from "chart.js";

// Register Chart.js components
Chart.register(...registerables);

export default function MemberDashboard() {
  const { stats, loading } = useMemberStats();

  // Initialize Chart.js for category distribution
  useEffect(() => {
    if (!stats || loading) return;

    const ctx = document.getElementById("categoryChart") as HTMLCanvasElement;
    const chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: stats.category_distribution.map((cat) => cat.category),
        datasets: [
          {
            data: stats.category_distribution.map((cat) => cat.count),
            backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
            borderColor: "#ffffff",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: window.matchMedia("(prefers-color-scheme: dark)").matches ? "#D1D5DB" : "#1F2937",
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw} artworks`,
            },
          },
        },
      },
    });

    return () => chart.destroy(); // Cleanup on unmount
  }, [stats, loading]);

  return (
    <div className="space-y-8 p-4 sm:p-6 animate-[fadeIn_0.5s_ease-in]">
      {/* Welcome Message */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome Back, {stats?.user?.first_name || "Member"}!
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Explore your dashboard to manage your artworks, events, and more.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : stats ? (
        <>
          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              asChild
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
              aria-label="Upload new artwork"
            >
              <Link to="/member/artworks/upload" className="flex items-center">
                <FiUpload className="w-5 h-5 mr-2" />
                Upload Artwork
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Join an event"
            >
              <Link to="/member/events" className="flex items-center">
                <FiCalendar className="w-5 h-5 mr-2" />
                Join Event
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="View portfolio"
            >
              <Link to="/member/portfolio" className="flex items-center">
                <FiImage className="w-5 h-5 mr-2" />
                View Portfolio
              </Link>
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-gray-900 dark:text-white">Total Artworks</CardTitle>
                <FiImage className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total_artworks}</p>
                <Link
                  to="/member/portfolio"
                  className="text-sm text-blue-500 dark:text-blue-400 hover:underline mt-2 inline-block"
                  aria-label="View your artworks"
                >
                  View Artworks
                </Link>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-gray-900 dark:text-white">Approval Rate</CardTitle>
                <FiFile className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.approval_rate}%</p>
                <Progress value={stats.approval_rate} className="mt-2" aria-label={`Approval rate: ${stats.approval_rate}%`} />
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-gray-900 dark:text-white">Recent Activity</CardTitle>
                <FiCalendar className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.recent_activity_logs.length}</p>
                <Link
                  to="/member/notifications"
                  className="text-sm text-blue-500 dark:text-blue-400 hover:underline mt-2 inline-block"
                  aria-label="View recent activity"
                >
                  View Activity
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Artwork Spotlight */}
          {stats.featured_artwork && (
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Featured Artwork</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                {stats.featured_artwork.image ? (
                  <img
                    src={stats.featured_artwork.image}
                    alt={stats.featured_artwork.title}
                    className="w-24 h-24 object-cover rounded-md"
                    aria-label={`Featured artwork: ${stats.featured_artwork.title}`}
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400">
                    No Image
                  </div>
                )}
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.featured_artwork.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stats.featured_artwork.category}</p>
                  <Link
                    to={`/member/artworks/${stats.featured_artwork.id}`}
                    className="text-sm text-blue-500 dark:text-blue-400 hover:underline mt-2 inline-block"
                    aria-label={`View details for ${stats.featured_artwork.title}`}
                  >
                    View Details
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Category Distribution */}
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Artworks by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <canvas id="categoryChart" className="max-w-sm" aria-label="Pie chart showing artwork distribution by category"></canvas>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          {stats.upcoming_events && stats.upcoming_events.length > 0 && (
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.upcoming_events.slice(0, 3).map((event: { id: string; title: string; date: string }) => (
                    <div key={event.id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        asChild
                        variant="outline"
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label={`Join event: ${event.title}`}
                      >
                        <Link to={`/member/events/${event.id}`}>Join Now</Link>
                      </Button>
                    </div>
                  ))}
                </div>
                <Link
                  to="/member/events"
                  className="text-sm text-blue-500 dark:text-blue-400 hover:underline mt-4 inline-block"
                  aria-label="View all upcoming events"
                >
                  View All Events
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity Timeline */}
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recent_activity_logs.length > 0 ? (
                <div className="relative pl-6">
                  <div className="absolute left-2.5 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  {stats.recent_activity_logs.map((log, idx) => (
                    <div key={idx} className="mb-6 relative">
                      <div className="absolute -left-4 top-1 w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-600"></div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{log.action}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{log.resource}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No recent activity found.</p>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardContent>
            <p className="text-red-500 dark:text-red-400">Failed to load data.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}