import { useState } from "react"
import { NotificationForm } from "../../components/admin/NotificationForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Project updates due next week", date: new Date().toISOString() }
  ])

  const sendNotification = (message: string) => {
    setNotifications([
      { id: Date.now(), message, date: new Date().toISOString() },
      ...notifications
    ])
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Notifications</h1>
        <NotificationForm onSubmit={sendNotification} />
      </div>

      <div className="space-y-4">
        {notifications.map((n) => (
          <Card key={n.id}>
            <CardHeader>
              <CardTitle>Notification</CardTitle>
              <CardDescription>{new Date(n.date).toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent>{n.message}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
