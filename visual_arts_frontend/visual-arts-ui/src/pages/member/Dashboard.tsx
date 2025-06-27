import { MemberStatCard } from "../../components/member/MemberStatCard"
import { MemberNotificationItem } from "../../components/member/MemberNotificationItem"
import { Brush, CalendarDays, FolderKanban } from "lucide-react"

const dummyNotifications = [
  { message: "Your artwork 'City Lights' was approved!", date: new Date().toISOString() },
  { message: "Event 'Art Marathon' is happening tomorrow.", date: new Date().toISOString() }
]

export default function MemberDashboard() {
  return (
    <div className="space-y-8">
      {/* Stat Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MemberStatCard title="My Artworks" value={7} icon={<Brush className="text-muted-foreground" />} />
        <MemberStatCard title="Registered Events" value={3} icon={<CalendarDays className="text-muted-foreground" />} />
        <MemberStatCard title="Active Projects" value={2} icon={<FolderKanban className="text-muted-foreground" />} />
      </div>

      {/* Notifications */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Notifications</h2>
        <div className="space-y-3">
          {dummyNotifications.map((n, idx) => (
            <MemberNotificationItem key={idx} message={n.message} date={n.date} />
          ))}
        </div>
      </div>
    </div>
  )
}
