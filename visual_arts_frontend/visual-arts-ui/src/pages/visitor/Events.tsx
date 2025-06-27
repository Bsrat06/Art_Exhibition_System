import { EventPublicCard } from "../../components/visitor/EventPublicCard"

const events = [
  {
    name: "Art Expo 2025",
    date: "2025-07-15",
    location: "ASTU Main Hall",
    description: "Our annual public exhibition of visual artworks."
  },
  {
    name: "Sketch Jam",
    date: "2025-08-03",
    location: "Studio B",
    description: "A free-form sketching and networking event."
  },
  {
    name: "Art for Awareness",
    date: "2025-08-20",
    location: "Campus Pavilion",
    description: "An open air show to support youth mental health."
  }
]

export default function VisitorEvents() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Upcoming Events</h1>
      <div className="space-y-4">
        {events.map((event, i) => (
          <EventPublicCard key={i} event={event} />
        ))}
      </div>
    </div>
  )
}
