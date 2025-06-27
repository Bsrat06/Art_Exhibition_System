import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Link } from "react-router-dom"

type Props = {
  artwork: {
    id: number
    title: string
    artist: string
    image: string
  }
}

export function ArtworkPublicCard({ artwork }: Props) {
  return (
    <Link to={`/artwork/${artwork.id}`}>
      <Card className="hover:shadow-lg transition">
        <CardHeader>
          <CardTitle className="text-base">{artwork.title}</CardTitle>
          <p className="text-xs text-muted-foreground">by {artwork.artist}</p>
        </CardHeader>
        <CardContent>
          <img src={artwork.image} alt={artwork.title} className="rounded w-full h-40 object-cover" />
        </CardContent>
      </Card>
    </Link>
  )
}
