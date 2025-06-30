import { useEffect, useState } from "react"
import API from "../../lib/api"
import { useAuth } from "../../hooks/useAuth"
import { Button } from "../../components/ui/button"
import { toast } from "sonner"
import { Calendar, MapPin, Users, Loader2, ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Skeleton } from "../../components/ui/skeleton"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "../../components/ui/tooltip"

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
  const [registering, setRegistering] = useState<number | null>(null)
  const [unregistering, setUnregistering] = useState<number | null>(null)

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

    setRegistering(eventId)
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
    } finally {
      setRegistering(null)
    }
  }

  const handleUnregister = async (eventId: number) => {
    setUnregistering(eventId)
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
    } finally {
      setUnregistering(null)
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const isRegistrationClosed = (event: Event) => {
    return event.registration_deadline && new Date(event.registration_deadline) < new Date()
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Upcoming Events</h1>
          <p className="text-muted-foreground max-w-2xl">
            Discover and register for our curated art events, exhibitions, and workshops
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video w-full rounded-b-none" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="text-center p-8">
            <div className="text-red-500 space-y-2">
              <p className="font-medium">Failed to load events</p>
              <p className="text-sm">{error}</p>
            </div>
          </Card>
        ) : events.length === 0 ? (
          <Card className="text-center p-12">
            <div className="space-y-4">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No upcoming events</h3>
              <p className="text-muted-foreground text-sm">
                Check back later for new events and exhibitions
              </p>
              {user && (
                <Button variant="outline" className="mt-4">
                  View past events
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card key={event.id} className="group overflow-hidden transition-all hover:shadow-lg">
                {event.event_cover ? (
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={event.event_cover}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    {isRegistrationClosed(event) && (
                      <Badge variant="destructive" className="absolute top-2 right-2">
                        Registration Closed
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-muted-foreground" />
                    {isRegistrationClosed(event) && (
                      <Badge variant="destructive" className="absolute top-2 right-2">
                        Registration Closed
                      </Badge>
                    )}
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                    {event.is_registered && (
                      <Badge variant="secondary" className="shrink-0">
                        Registered
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{formatDate(event.date)}</p>
                      {event.registration_deadline && (
                        <p className="text-xs text-muted-foreground">
                          Registration until {formatDate(event.registration_deadline)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <p className="text-sm font-medium">{event.location}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {event.attendees_count} attending
                        </p>
                        {event.capacity && (
                          <p className="text-xs text-muted-foreground">
                            {event.capacity - event.attendees_count} spots left
                          </p>
                        )}
                      </div>
                      {event.capacity && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mt-1">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ 
                              width: `${Math.min(100, (event.attendees_count / event.capacity) * 100)}%` 
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  {user ? (
                    event.is_registered ? (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleUnregister(event.id)}
                        disabled={!!unregistering}
                      >
                        {unregistering === event.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="mr-2 h-4 w-4" />
                        )}
                        Unregister
                      </Button>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="default" 
                            className="w-full"
                            onClick={() => handleRegister(event.id)}
                            disabled={
                              isRegistrationClosed(event) || 
                              (event.capacity !== null && event.attendees_count >= event.capacity) ||
                              !!registering
                            }
                          >
                            {registering === event.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <ArrowRight className="mr-2 h-4 w-4" />
                            )}
                            Register
                          </Button>
                        </TooltipTrigger>
                        {isRegistrationClosed(event) && (
                          <TooltipContent>
                            <p>Registration deadline has passed</p>
                          </TooltipContent>
                        )}
                        {event.capacity !== null && event.attendees_count >= event.capacity && (
                          <TooltipContent>
                            <p>This event is at full capacity</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    )
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          disabled
                        >
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Register
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Please login to register for events</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}