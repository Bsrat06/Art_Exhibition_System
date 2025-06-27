import { useState } from "react"
import { EventCard } from "../../components/member/EventCard"

const availableEvents = [
  { id: 1, name: "Art Expo", description: "Annual exhibition of club works", location: "ASTU Hall", date: "2025-07-15" },
  { id: 2, name: "Live Sketch Night", description: "A night of spontaneous drawing sessions", location: "Studio B", date: "2025-08-01" },
  { id: 3, name: "Art Therapy Workshop", description: "Explore healing through art", location: "Workshop Room 2", date: "2025-08-20" }
]

export default function MemberEvents() {
  const [registeredIds, setRegisteredIds] = useState<number[]>([1]) // Assume member is registered for Event 1

  const toggleRegistration = (eventId: number) => {
    const isAlready = registeredIds.includes(eventId)
    setRegisteredIds(isAlready ? registeredIds.filter(id => id !== eventId) : [...registeredIds, eventId])
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Available Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isRegistered={registeredIds.includes(event.id)}
            onToggle={toggleRegistration}
          />
        ))}
      </div>
    </div>
  )
}
