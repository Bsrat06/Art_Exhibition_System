import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"

type Props = {
  triggerLabel?: string
  initialData?: any
  onSubmit: (data: any) => void
}

export function ProjectForm({ triggerLabel = "Add Project", initialData, onSubmit }: Props) {
  const [form, setForm] = useState(initialData || {
    title: "", description: "", progress: 0
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          <DialogTitle>{initialData ? "Edit Project" : "Add New Project"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <Input name="title" placeholder="Project Title" value={form.title} onChange={handleChange} />
          <Textarea name="description" placeholder="Project Description" value={form.description} onChange={handleChange} />
          <Input type="number" name="progress" placeholder="Progress (%)" value={form.progress} onChange={handleChange} />
          <Button className="w-full mt-2" onClick={handleSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
