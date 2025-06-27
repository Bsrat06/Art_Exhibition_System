import { useState, useEffect } from "react"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
// import { Textarea } from "../../components/ui/textarea"
import API from "../../lib/api"

export default function MemberProfile() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    profile_picture: null as File | null
  })

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [message, setMessage] = useState("")

  // Load current user profile
  useEffect(() => {
    API.get("/auth/user/").then((res) => {
      const { first_name, last_name, email, profile_picture } = res.data
      setForm((f) => ({ ...f, first_name, last_name, email }))
      setPreviewUrl(profile_picture || null)
    })
  }, [])

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    if (name === "profile_picture" && files) {
      setForm({ ...form, profile_picture: files[0] })
      setPreviewUrl(URL.createObjectURL(files[0]))
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  // Submit update
  const handleSubmit = async () => {
    setMessage("")

    const data = new FormData()
    data.append("first_name", form.first_name)
    data.append("last_name", form.last_name)
    data.append("email", form.email)
    if (form.password) data.append("password", form.password)
    if (form.profile_picture) data.append("profile_picture", form.profile_picture)

    try {
      await API.put("/auth/profile/update/", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      setMessage("✅ Profile updated successfully.")
    } catch (err: any) {
      setMessage("❌ Failed to update profile.")
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-xl font-semibold">Edit Profile</h1>

      <div className="space-y-4">
        <div>
          <Label>First Name</Label>
          <Input name="first_name" value={form.first_name} onChange={handleChange} />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input name="last_name" value={form.last_name} onChange={handleChange} />
        </div>
        <div>
          <Label>Email</Label>
          <Input name="email" type="email" value={form.email} onChange={handleChange} />
        </div>
        <div>
          <Label>New Password</Label>
          <Input name="password" type="password" value={form.password} onChange={handleChange} />
        </div>
        <div>
          <Label>Profile Picture</Label>
          <Input name="profile_picture" type="file" accept="image/*" onChange={handleChange} />
          {previewUrl && (
            <img src={previewUrl} alt="Preview" className="w-24 h-24 rounded-full mt-2 border" />
          )}
        </div>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
        <Button onClick={handleSubmit}>Save Changes</Button>
      </div>
    </div>
  )
}
