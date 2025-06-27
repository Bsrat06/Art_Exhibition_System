import { NotificationItem } from "../../components/member/NotificationItem"

const dummyNotifications = [
  {
    id: 1,
    message: "You're now registered for 'Art Expo 2025'.",
    date: "2025-06-25T09:30:00"
  },
  {
    id: 2,
    message: "Reminder: 'Street Art Tour' project starts tomorrow.",
    date: "2025-06-24T16:45:00"
  }
]

export default function MemberNotifications() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">My Notifications</h1>
      <div className="space-y-4">
        {dummyNotifications.map((n) => (
          <NotificationItem key={n.id} message={n.message} date={n.date} />
        ))}
      </div>
    </div>
  )
}
