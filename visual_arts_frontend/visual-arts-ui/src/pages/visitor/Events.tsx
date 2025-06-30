import { useEffect, useState } from "react"
import { EventPublicCard } from "../../components/visitor/EventPublicCard"
import API from "../../lib/api"
import { useAuth } from "../../hooks/useAuth"
import { Button } from "../../components/ui/button"
import { toast } from "sonner"
import { Calendar, MapPin } from "lucide-react"

interface Event {
  id: number
  title: string
  description: string
  location: string
  date: string
  event_cover: string | null
  is_registered?: boolean
  registration_deadline: string | null
  capacity: number | null
  attendees_count: number
}

export default function VisitorEvents() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get("/events/upcoming/")
        let eventsData = res.data.results || res.data  // Handle both paginated and non-paginated responses

        // If user is logged in, check their registration status
        if (user) {
          try {
            const registeredRes = await API.get("/events/registered/")
            const registeredEventIds = new Set(registeredRes.data.map((event: { id: number }) => event.id));
            eventsData = eventsData.map((event: Event) => ({
              ...event,
              is_registered: registeredEventIds.has(event.id)
            }))
          } catch (error) {
            console.error("Failed to fetch registered events", error)
          }
        }

        setEvents(eventsData)
      } catch (err) {
        console.error("Failed to load events:", err)
        setError("Failed to load events. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [user])

  const handleRegister = async (eventId: number) => {
    if (!user) {
      toast.error("Please login to register for events")
      return
    }

    try {
      await API.post(`/events/${eventId}/register/`)
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { 
              ...event, 
              is_registered: true,
              attendees_count: event.attendees_count + 1 
            } 
          : event
      ))
      toast.success("Successfully registered for event!")
    } catch (error) {
      console.error("Registration failed", error)
      toast.error("Failed to register for event")
    }
  }

  const handleUnregister = async (eventId: number) => {
    try {
      await API.post(`/events/${eventId}/unregister/`)
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { 
              ...event, 
              is_registered: false,
              attendees_count: event.attendees_count - 1 
            } 
          : event
      ))
      toast.success("Successfully unregistered from event")
    } catch (error) {
      console.error("Unregistration failed", error)
      toast.error("Failed to unregister from event")
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Upcoming Events</h1>
      <p className="text-muted-foreground">
        Discover and register for our upcoming art events and exhibitions
      </p>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading events...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      ) : events.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p>No upcoming events found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {event.event_cover && (
                <div className="relative aspect-video">
                  <img
                    src={event.event_cover}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-sm text-muted-foreground">{event.description}</p>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(event.date)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {event.attendees_count} attending
                    {event.capacity && ` / ${event.capacity} capacity`}
                  </span>
                  
                  {user ? (
                    event.is_registered ? (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleUnregister(event.id)}
                      >
                        Unregister
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleRegister(event.id)}
                        disabled={
                          event.registration_deadline && 
                          new Date(event.registration_deadline) < new Date()
                        }
                      >
                        Register
                      </Button>
                    )
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled
                      title="Please login to register"
                    >
                      Register
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}