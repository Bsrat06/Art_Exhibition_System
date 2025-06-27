import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

type Props = {
  triggerLabel?: string
  initialData?: any
  onSubmit: (data: any) => void
}

export function EventForm({ triggerLabel = "Add Event", initialData, onSubmit }: Props) {
  const [form, setForm] = useState(initialData || {
    name: "", location: "", date: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    onSubmit({ ...form, id: initialData?.id ?? Date.now() })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Event" : "Add New Event"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <Input name="name" placeholder="Event Name" value={form.name} onChange={handleChange} />
          <Input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
          <Input name="date" type="date" value={form.date} onChange={handleChange} />
          <Button className="w-full mt-2" onClick={handleSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
