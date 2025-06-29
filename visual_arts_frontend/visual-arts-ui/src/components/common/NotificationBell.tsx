import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { Link } from "react-router-dom"
import API from "../../lib/api"

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    API.get("/notifications/")
      .then(res => {
        const unread = res.data.filter((n: any) => !n.read).length
        setUnreadCount(unread)
      })
      .catch(() => console.warn("Could not fetch notifications"))
  }, [])

  return (
    <Link to="/admin/notifications" className="relative inline-block">
      <Bell className="w-6 h-6 text-muted-foreground" />
      {unreadCount > 0 && (
        <Badge className="absolute -top-1 -right-2 text-xs px-1.5 bg-red-600 text-white rounded-full">
          {unreadCount}
        </Badge>
      )}
    </Link>
  )
}
