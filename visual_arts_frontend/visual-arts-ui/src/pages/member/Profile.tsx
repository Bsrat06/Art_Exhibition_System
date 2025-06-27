import { useState } from "react"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"

const initialProfile = {
  name: "Sara Ali",
  email: "sara@example.com",
  bio: "I specialize in digital illustrations and mixed media."
}

export default function MemberProfile() {
  const [profile, setProfile] = useState(initialProfile)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile({ ...profile, [name]: value })
  }

  const handleSave = () => {
    // For now just log
    console.log("Profile updated:", profile)
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-xl font-semibold">My Profile</h1>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" value={profile.name} onChange={handleChange} />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={profile.email} onChange={handleChange} />
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" name="bio" rows={4} value={profile.bio} onChange={handleChange} />
        </div>

        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  )
}
