import { useState } from "react"
import { ArtworkUploadForm } from "./ArtworkUploadForm"
import { MyArtworkCard } from "./MyArtworkCard"

const initialArtworks = [
  {
    id: 1,
    title: "City Lights",
    description: "Night life from a rooftop.",
    image: "https://via.placeholder.com/300x200?text=City+Lights",
    status: "approved"
  },
  {
    id: 2,
    title: "Lost in Color",
    description: "Abstract emotion explosion.",
    image: "https://via.placeholder.com/300x200?text=Lost+in+Color",
    status: "pending"
  }
]

export default function Portfolio() {
  const [artworks, setArtworks] = useState(initialArtworks)

  const uploadArtwork = (data: any) => {
    setArtworks([data, ...artworks])
  }

  const deleteArtwork = (id: number) => {
    setArtworks(artworks.filter((a) => a.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">My Portfolio</h1>
        <ArtworkUploadForm onSubmit={uploadArtwork} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((art) => (
          <MyArtworkCard key={art.id} artwork={art} onDelete={deleteArtwork} />
        ))}
      </div>
    </div>
  )
}
