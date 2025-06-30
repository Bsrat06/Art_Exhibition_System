import { useEffect, useState } from "react"
import { ArtworkPublicCard } from "../../components/visitor/ArtworkPublicCard"
import API from "../../lib/api"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "../../components/ui/select"
import { Filter } from "lucide-react"
import { useDebounce } from "../../hooks/use-debounce"

interface Artwork {
  id: number
  title: string
  artist_name: string
  image: string
  category: string
  description: string
  submission_date: string
}

export default function VisitorGallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [categories, setCategories] = useState<string[]>([])
  const debouncedSearch = useDebounce(searchQuery, 500)

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        let url = "/artwork/?approval_status=approved"
        if (debouncedSearch) url += `&search=${debouncedSearch}`
        if (categoryFilter !== "all") url += `&category=${categoryFilter}`

        const res = await API.get(`/artwork/?approval_status=approved&page_size=1000`)
        setArtworks(res.data.results)
        
        // Extract unique categories from approved artworks
        const uniqueCategories = Array.from(
          new Set(res.data.results.map((art: Artwork) => art.category).filter(Boolean))
        )
        setCategories(uniqueCategories)
      } catch (err) {
        console.error("Failed to load artworks:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchArtworks()
  }, [debouncedSearch, categoryFilter])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Artwork Gallery</h1>
      <p className="text-muted-foreground">Browse our collection of approved artworks</p>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder="Search artworks by title, artist, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>Category: {categoryFilter === "all" ? "All" : categoryFilter}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading artworks...</p>
        </div>
      ) : artworks.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p>No approved artworks found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map((artwork) => (
            <ArtworkPublicCard
              key={artwork.id}
              artwork={{
                id: artwork.id,
                title: artwork.title,
                artist: artwork.artist_name,
                image: artwork.image,
                description: artwork.description,
                category: artwork.category,
                date: artwork.submission_date
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}