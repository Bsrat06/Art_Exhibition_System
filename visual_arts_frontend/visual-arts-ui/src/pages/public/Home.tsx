import { useEffect, useState } from "react";
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Calendar, ChevronLeft, ChevronRight, Paintbrush, Users, Mail } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import API from "../../lib/api";

type Artwork = {
  id: number;
  title: string;
  artist: string;
  image_url: string;
  category: string;
};

type Event = {
  id: number;
  title: string;
  date: string;
  description: string;
};

type NewsletterForm = {
  email: string;
};

// Custom arrow components for the carousel
const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <Button
    variant="outline"
    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-teal-500 hover:text-white"
    onClick={onClick}
    aria-label="Previous slide"
  >
    <ChevronLeft className="w-3.5 h-3.5" />
  </Button>
);

const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <Button
    variant="outline"
    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-teal-500 hover:text-white"
    onClick={onClick}
    aria-label="Next slide"
  >
    <ChevronRight className="w-3.5 h-3.5" />
  </Button>
);

export default function Home() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewsletterForm>();
  const [loading, setLoading] = useState(true)

  // Fetch featured artworks and upcoming events
  useEffect(() => {
  const fetchArtworks = async () => {
    try {
      const res = await API.get("/featured-artworks/")
      setArtworks(res.data.results) // ✅ FIXED: use .results
    } catch (err) {
      console.error("Failed to load artworks:", err)
    } finally {
      setLoading(false)
    }
  }

  fetchArtworks()
}, [])


  // Handle newsletter subscription
  const onSubmit = async (data: NewsletterForm) => {
    try {
      await API.post("/newsletter/subscribe/", { email: data.email });
      toast.success("Subscribed successfully!");
      reset();
      setDialogOpen(false);
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    }
  };

  // Carousel settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative text-center py-16 bg-gradient-to-br from-teal-500 to-blue-600 dark:from-teal-600 dark:to-blue-800 rounded-xl shadow-lg animate-[fadeIn_0.5s_ease-in]">
        <div className="absolute inset-0 bg-[url('https://source.unsplash.com/random/1600x400?art')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to Visual Arts Club 🎨</h1>
          <p className="text-base text-white/80 max-w-2xl mx-auto">Inspiring creativity, connecting artists, and celebrating the beauty of art.</p>
          <div className="mt-6 flex gap-4 justify-center">
            <Button
              className="text-sm bg-white text-teal-600 hover:bg-teal-100 transition-transform hover:scale-105"
              onClick={() => setDialogOpen(true)}
            >
              Join the Club
              <Users className="w-3.5 h-3.5 ml-1.5" />
            </Button>
            <Button
              variant="outline"
              className="text-sm border-white text-white hover:bg-teal-500 hover:border-teal-500 transition-transform hover:scale-105"
              asChild
            >
              <a href="/submit">Submit Artwork <Paintbrush className="w-3.5 h-3.5 ml-1.5" /></a>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Artwork Carousel */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">Featured Artwork</h2>
        <Slider {...sliderSettings}>
          {artworks.map(artwork => (
            <div key={artwork.id} className="px-2">
              <div className="relative group rounded-lg overflow-hidden shadow-sm transition-transform hover:scale-[1.02] bg-white dark:bg-gray-800">
                <img
                  src={artwork.image_url}
                  alt={artwork.title}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-base font-medium">{artwork.title}</h3>
                    <p className="text-sm text-white/80">by {artwork.artist}</p>
                    <p className="text-xs text-white/60">{artwork.category}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Upcoming Events */}
      <section className="py-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Upcoming Events</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map(event => (
            <div
              key={event.id}
              className="p-6 border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm transition-transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-3.5 h-3.5 text-teal-500" />
                <h3 className="text-base font-medium">{event.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
              <p className="text-sm mt-2">{event.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 bg-gradient-to-br from-yellow-500 to-orange-500 dark:from-yellow-600 dark:to-orange-600 rounded-xl p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-white">Stay in the Loop</h2>
        <p className="text-base text-white/80 max-w-md mx-auto mb-6">
          Subscribe to our newsletter for the latest updates on events, artworks, and artist spotlights.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 justify-center">
          <Input
            type="email"
            placeholder="Enter your email"
            className="text-sm max-w-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600"
            {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
            aria-invalid={errors.email ? "true" : "false"}
          />
          <Button type="submit" className="text-sm bg-white text-yellow-600 hover:bg-yellow-100">Subscribe <Mail className="w-3.5 h-3.5 ml-1.5" /></Button>
        </form>
        {errors.email && <p className="text-xs text-white mt-2">{errors.email.message}</p>}
      </section>

      {/* Join Club Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-lg">Join the Visual Arts Club</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Become a member to connect with artists, attend exclusive events, and showcase your work.
            </p>
            <Button asChild className="w-full text-sm bg-teal-500 hover:bg-teal-600">
              <a href="/signup">Sign Up Now</a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}