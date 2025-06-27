import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"

export default function Reports() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Reports</h1>

      <div className="flex gap-4">
        <Input type="date" />
        <Input type="date" />
        <Button>Filter</Button>
      </div>

      <div className="space-y-4 mt-4">
        <div className="p-4 border rounded-lg bg-gray-50">
          <p>Total Members: <strong>42</strong></p>
          <p>Total Events: <strong>8</strong></p>
          <p>Submitted Artworks: <strong>138</strong></p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Download PDF</Button>
          <Button variant="outline">Export to Excel</Button>
        </div>
      </div>
    </div>
  )
}
