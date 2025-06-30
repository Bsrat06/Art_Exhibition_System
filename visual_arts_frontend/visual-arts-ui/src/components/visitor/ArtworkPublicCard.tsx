import { Heart } from "lucide-react"
import { Button } from "../ui/button"

interface ArtworkPublicCardProps {
  artwork: {
    id: number
    title: string
    artist: string
    image: string
    description: string
    category: string
    date: string
    likes: number
    isLiked: boolean
  }
  onLike: () => void
}

export function ArtworkPublicCard({ artwork, onLike }: ArtworkPublicCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-square">
        <img
          src={artwork.image}
          alt={artwork.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{artwork.title}</h3>
        <p className="text-sm text-muted-foreground">{artwork.artist}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-sm text-muted-foreground">{artwork.category}</span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onLike}
              className="h-8 w-8"
            >
              <Heart
                className={`w-4 h-4 ${artwork.isLiked ? "fill-red-500 text-red-500" : ""}`}
              />
            </Button>
            <span className="text-sm">{artwork.likes}</span>
          </div>
        </div>
      </div>
    </div>
  )
}