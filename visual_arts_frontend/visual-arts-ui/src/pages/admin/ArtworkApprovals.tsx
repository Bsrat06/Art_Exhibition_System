import { useEffect, useState } from "react"
import API from "../../lib/api"
import { Button } from "../../components/ui/button"
import { Textarea } from "../../components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog"
// import { Input } from "../../components/ui/input"

type Artwork = {
  id: number
  title: string
  image: string
  description: string
  category: string
  artist_name: string
  submission_date: string
}

export default function ArtworkApprovals() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [selected, setSelected] = useState<Artwork | null>(null)
  const [feedback, setFeedback] = useState("")
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    fetchArtworks()
  }, [])

  const fetchArtworks = async () => {
    const res = await API.get("/artwork/?approval_status=pending")
    setArtworks(res.data.results || [])
  }


  const handleApprove = async (id: number) => {
    await API.patch(`/artwork/${id}/approve/`)
    fetchArtworks()
    setShowDialog(false)
  }

  const handleReject = async () => {
    if (!selected || !feedback.trim()) return
    await API.patch(`/artwork/${selected.id}/reject/`, { feedback })
    fetchArtworks()
    setShowDialog(false)
    setFeedback("")
  }

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">Pending Artwork Approvals</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((art) => (
          <div key={art.id} className="bg-white p-4 rounded shadow space-y-2">
            <img src={art.image} alt={art.title} className="w-full h-40 object-cover rounded" />
            <h2 className="font-semibold">{art.title}</h2>
            <p className="text-sm text-muted-foreground">By: {art.artist_name}</p>
            <p className="text-sm text-muted-foreground">Category: {art.category}</p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={() => handleApprove(art.id)}>Approve</Button>
              <Button size="sm" variant="destructive" onClick={() => {
                setSelected(art)
                setShowDialog(true)
              }}>Reject</Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Artwork</DialogTitle>
          </DialogHeader>
          <p className="text-sm">Please provide feedback for rejecting "{selected?.title}"</p>
          <Textarea rows={4} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>Submit Rejection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
