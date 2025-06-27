import { useEffect, useState } from "react";
import API from "../../lib/api";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";
import { AxiosError } from "axios";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  event_cover: string | null;
  attendees: number[];
  creator: number;
  is_completed: boolean;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Event[];
}

export default function MemberEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<number | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch events
        const eventsResponse = await API.get<ApiResponse>("/events/");
        setEvents(eventsResponse.data.results);

        // Fetch user registrations if needed
        try {
          const registrations = await API.get<number[]>("/events/my_registrations/");
          setRegisteredEvents(registrations.data);
        } catch (regError) {
          console.log("Could not fetch registrations", regError);
        }
      } catch (error) {
        handleApiError(error, "Failed to load events");
      }
    };
    fetchData();
  }, []);

  const register = async (eventId: number) => {
    setLoading(eventId);
    try {
      await API.post(`/events/${eventId}/register/`, {});
      setRegisteredEvents(prev => [...prev, eventId]);
      toast({ title: "Success", description: "Registered successfully!" });
    } catch (error) {
      handleApiError(error, "Registration failed");
    } finally {
      setLoading(null);
    }
  };

  const handleApiError = (error: unknown, defaultMessage: string) => {
    const axiosError = error as AxiosError<{ error?: string; detail?: string }>;
    toast({
      title: "Error",
      description: axiosError.response?.data?.error || 
                  axiosError.response?.data?.detail || 
                  defaultMessage,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">Available Events</h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-500">No events found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white p-4 rounded shadow space-y-2">
              {event.event_cover && (
                <img 
                  src={event.event_cover} 
                  alt={event.title} 
                  className="w-full h-40 object-cover rounded" 
                />
              )}
              <h2 className="text-lg font-semibold">{event.title}</h2>
              <p className="text-sm">{event.description}</p>
              <p className="text-sm text-muted-foreground">📍 {event.location}</p>
              <p className="text-sm text-muted-foreground">📅 {event.date}</p>

              <Button
                onClick={() => register(event.id)}
                disabled={event.is_completed || loading === event.id || registeredEvents.includes(event.id)}
              >
                {event.is_completed
                  ? "Event Completed"
                  : registeredEvents.includes(event.id)
                  ? "Registered ✓"
                  : loading === event.id
                  ? "Registering..."
                  : "Register"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}