import { useState } from "react"
import type { Artwork } from "../../components/admin/ArtworkCard"
import { ArtworkCard } from "../../components/admin/ArtworkCard"

const initialArtworks: Artwork[] = [
  {
    id: 1,
    title: "Sunset Reflection",
    artist: "Liya Tesfaye",
    description: "Inspired by the colors of the setting sun.",
    image: "https://via.placeholder.com/300x200?text=Sunset",
    status: "pending"
  },
  {
    id: 2,
    title: "The Forest Whisper",
    artist: "Yonas Kebede",
    description: "An abstract take on deep forest emotions.",
    image: "https://via.placeholder.com/300x200?text=Forest",
    status: "pending"
  }
]

export default function ArtworkApprovals() {
  const [artworks, setArtworks] = useState(initialArtworks)

  const approveArtwork = (id: number) => {
    setArtworks(prev => prev.map(a => a.id === id ? { ...a, status: "approved" } : a))
  }

  const rejectArtwork = (id: number) => {
    setArtworks(prev => prev.map(a => a.id === id ? { ...a, status: "rejected" } : a))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Artwork Approvals</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks
          .filter(a => a.status === "pending")
          .map(artwork => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              onApprove={approveArtwork}
              onReject={rejectArtwork}
            />
          ))}
      </div>
      {artworks.filter(a => a.status === "pending").length === 0 && (
        <p className="text-muted-foreground text-center py-6">No pending artwork submissions.</p>
      )}
    </div>
  )
}
