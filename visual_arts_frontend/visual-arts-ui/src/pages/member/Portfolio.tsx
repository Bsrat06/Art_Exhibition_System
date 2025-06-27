import { useState, useEffect } from "react"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import API from "../../lib/api"

type Artwork = {
  id: number
  title: string
  category: string
  description: string
  image: string
  approval_status: string
  submission_date: string
  feedback?: string
}

export default function Portfolio() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    image: null as File | null
  })

  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [preview, setPreview] = useState<string | null>(null)
  const [message, setMessage] = useState("")

  // Fetch own artworks
  useEffect(() => {
    API.get("/artwork/my_artworks/")
      .then(res => setArtworks(res.data))
      .catch(() => console.warn("Failed to fetch portfolio"))
  }, [])

  // Input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> // <--- Updated type
  ) => {
    const { name, value } = e.target; // 'files' is removed from destructuring here

    if (e.target instanceof HTMLInputElement) {
      if (e.target.type === "file") { // Specifically check if it's a file input
        const files = e.target.files;
        if (name === "image" && files && files.length > 0) {
          setForm({ ...form, image: files[0] });
          setPreview(URL.createObjectURL(files[0]));
        }
      } else {
        // Handle other HTMLInputElement types (text, number, etc.)
        setForm({ ...form, [name]: value });
      }
    } else if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
      // Handle Textarea and Select elements, which both have 'name' and 'value'
      setForm({ ...form, [name]: value });
    }
  }


  const handleUpload = async () => {
    const data = new FormData()
    data.append("title", form.title)
    data.append("category", form.category)
    data.append("description", form.description)
    if (form.image) data.append("image", form.image)

    try {
      await API.post("/artwork/", data, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setMessage("✅ Artwork uploaded!")
      setForm({ title: "", category: "", description: "", image: null })
      setPreview(null)
      const res = await API.get("/artwork/my_artworks/")
      setArtworks(res.data)
    } catch (err) {
      console.error(err)
      setMessage("❌ Upload failed.")
    }
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-xl font-semibold">Upload Artwork</h1>

      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input name="title" value={form.title} onChange={handleChange} />
        </div>
        <div>
          <Label>Category</Label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">-- Select Category --</option>
            <option value="sketch">Sketch</option>
            <option value="canvas">Canvas</option>
            <option value="wallart">Wall Art</option>
            <option value="digital">Digital</option>
            <option value="photography">Photography</option>
          </select>
        </div>
        <div>
          <Label>Description</Label>
          <Textarea name="description" value={form.description} onChange={handleChange} />
        </div>
        <div>
          <Label>Image</Label>
          <Input type="file" name="image" accept="image/*" onChange={handleChange} />
          {preview && <img src={preview} alt="Preview" className="w-40 mt-2 rounded shadow" />}
        </div>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
        <Button onClick={handleUpload}>Submit Artwork</Button>
      </div>

      <hr />

      <h2 className="text-lg font-semibold mt-8">My Uploaded Artworks</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {artworks.map((art) => (
          <div key={art.id} className="border rounded p-3 shadow bg-white">
            <img src={art.image} alt={art.title} className="w-full h-40 object-cover rounded" />
            <p className="font-semibold mt-1">{art.title}</p>
            <p className="text-sm text-muted-foreground">Category: {art.category}</p>
            <p className="text-sm text-muted-foreground">Status: {art.approval_status}</p>
            {art.approval_status === "rejected" && (
              <p className="text-sm text-red-500 mt-1">Feedback: {art.feedback}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
