interface Props {
  artwork: {
    id: number
    title: string
    artist: string
    image: string
  }
}

export function ArtworkPublicCard({ artwork }: Props) {
  return (
    <div className="rounded overflow-hidden shadow bg-card">
      <img src={artwork.image} alt={artwork.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{artwork.title}</h3>
        <p className="text-muted-foreground text-sm">By {artwork.artist}</p>
      </div>
    </div>
  )
}
