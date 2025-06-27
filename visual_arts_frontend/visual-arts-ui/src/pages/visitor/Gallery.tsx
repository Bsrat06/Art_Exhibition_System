import { ArtworkPublicCard } from "../../components/visitor/ArtworkPublicCard"

const publicArtworks = [
  {
    id: 1,
    title: "Dreamscape",
    artist: "Liya Tesfaye",
    image: "https://via.placeholder.com/400x250?text=Dreamscape"
  },
  {
    id: 2,
    title: "Golden Hour",
    artist: "Musa Bekele",
    image: "https://via.placeholder.com/400x250?text=Golden+Hour"
  },
  {
    id: 3,
    title: "Roots and Wings",
    artist: "Sara Ali",
    image: "https://via.placeholder.com/400x250?text=Roots+%26+Wings"
  }
]

export default function VisitorGallery() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Artwork Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {publicArtworks.map((artwork) => (
          <ArtworkPublicCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </div>
  )
}
