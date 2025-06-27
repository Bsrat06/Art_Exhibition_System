import { useState } from "react"
import { EventForm } from "../../components/admin/EventForm"
import { EventTable } from "../../components/admin/EventTable"

const initialEvents = [
  { id: 1, name: "Art Expo 2024", location: "Addis Ababa", date: "2024-08-12" },
  { id: 2, name: "Painting Workshop", location: "ASTU Campus", date: "2024-09-20" }
]

export default function ManageEvents() {
  const [events, setEvents] = useState(initialEvents)

  const addEvent = (newEvent: any) => {
    setEvents([...events, newEvent])
  }

  const editEvent = (updated: any) => {
    setEvents(events.map(e => e.id === updated.id ? updated : e))
  }

  const deleteEvent = (id: number) => {
    setEvents(events.filter(e => e.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Manage Events</h1>
        <EventForm onSubmit={addEvent} />
      </div>
      <EventTable events={events} onEdit={editEvent} onDelete={deleteEvent} />
    </div>
  )
}
