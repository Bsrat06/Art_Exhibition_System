import { useEffect, useState } from "react"
import API from "../../lib/api"
// import { Button } from "../../components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/ui/accordion"

type Event = {
  id: number
  title: string
  description: string
  location: string
  date: string
  event_cover: string
  is_completed: boolean
  attendees: {
    id: number
    first_name: string
    last_name: string
    email: string
  }[]
}

export default function ManageEvents() {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    API.get("/events/").then(res => setEvents(res.data.results || res.data))
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">Manage Events</h1>

      {events.map(event => (
        <div key={event.id} className="bg-white border rounded p-4 shadow space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">{event.title}</h2>
              <p className="text-sm text-muted-foreground">📅 {event.date} | 📍 {event.location}</p>
              <p className="text-sm">{event.description}</p>
            </div>
            {event.event_cover && (
              <img src={event.event_cover} className="w-28 h-20 object-cover rounded ml-4" />
            )}
          </div>

          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="participants">
              <AccordionTrigger>View Participants ({event.attendees.length})</AccordionTrigger>
              <AccordionContent>
                {event.attendees.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No one has registered yet.</p>
                ) : (
                  <ul className="text-sm space-y-1">
                    {event.attendees.map((user) => (
                      <li key={user.id}>
                        👤 {user.first_name} {user.last_name} – {user.email}
                      </li>
                    ))}
                  </ul>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </div>
  )
}
