import { StatCard } from "../../components/admin/StatCard"
import { Users, Brush, CalendarDays, FolderKanban } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Members" value={42} icon={<Users className="text-muted-foreground" />} />
        <StatCard title="Artworks Submitted" value={138} icon={<Brush className="text-muted-foreground" />} />
        <StatCard title="Upcoming Events" value={3} icon={<CalendarDays className="text-muted-foreground" />} />
        <StatCard title="Active Projects" value={5} icon={<FolderKanban className="text-muted-foreground" />} />
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="p-3 border rounded-lg text-sm">🎨 New artwork submitted by <strong>Samira</strong></div>
          <div className="p-3 border rounded-lg text-sm">👤 New member registered: <strong>Daniel T.</strong></div>
          <div className="p-3 border rounded-lg text-sm">📅 Event “Gallery Night” scheduled</div>
          <div className="p-3 border rounded-lg text-sm">📝 Project “Summer Collab” updated</div>
        </div>
      </div>
    </div>
  )
}
