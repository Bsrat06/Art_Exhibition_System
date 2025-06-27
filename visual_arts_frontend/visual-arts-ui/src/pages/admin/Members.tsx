import { useEffect, useState } from "react"
import API from "../../lib/api"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

type User = {
  pk: number
  first_name: string
  last_name: string
  email: string
  role: string
  is_active: boolean
}

export default function ManageMembers() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)

  const fetchUsers = async (page = 1) => {
    const res = await API.get(`/users/?page=${page}`)
    const data = res.data
    setUsers(data.results || [])
    setHasNext(!!data.next)
    setHasPrev(!!data.previous)
  }

  useEffect(() => {
    fetchUsers(page)
  }, [page])

  const handleRoleChange = async (id: number, role: string) => {
    await API.patch(`/users/${id}/update-role/`, { role })
    setUsers(users.map(u => u.pk === id ? { ...u, role } : u))
  }

  const handleToggleStatus = async (id: number, is_active: boolean) => {
    const url = `/users/${id}/${is_active ? "deactivate" : "activate"}/`
    await API.patch(url)
    setUsers(users.map(u => u.pk === id ? { ...u, is_active: !is_active } : u))
  }

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.first_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.last_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">Manage Members</h1>

      <Input
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-muted text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.pk} className="border-t">
                <td className="p-2">{user.first_name} {user.last_name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  <Select value={user.role} onValueChange={(val) => handleRoleChange(user.pk, val)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">{user.is_active ? "Active" : "Inactive"}</td>
                <td className="p-2 space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleToggleStatus(user.pk, user.is_active)}>
                    {user.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((prev) => prev - 1)}
          disabled={!hasPrev}
        >
          ← Previous
        </Button>
        <span className="text-sm text-muted-foreground">Page {page}</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!hasNext}
        >
          Next →
        </Button>
      </div>
    </div>
  )
}
