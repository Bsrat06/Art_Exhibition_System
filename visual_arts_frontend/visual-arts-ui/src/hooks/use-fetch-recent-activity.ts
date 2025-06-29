import { useEffect, useState } from "react"
import API from "../lib/api"

interface ActivityItem {
  id: string
  type: string
  title: string
  user?: {
    name: string
    avatar?: string
  }
  timestamp: string
  status?: string
}

export function useFetchRecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        const res = await API.get("/activity/recent/")
        
        // Transform API response to our ActivityItem format
        const formattedActivities = res.data.map((item: any) => ({
          id: item.id,
          type: item.activity_type,
          title: item.description,
          user: item.user ? {
            name: `${item.user.first_name} ${item.user.last_name}`,
            avatar: item.user.profile_picture
          } : undefined,
          timestamp: item.created_at,
          status: item.status
        }))

        setActivities(formattedActivities)
      } catch (err) {
        console.error("Failed to fetch activities:", err)
        setError("Failed to load recent activity")
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  return { activities, loading, error }
}