import { useState } from "react"
import { MemberForm } from "../../components/admin/MemberForm"
import { MemberTable } from "../../components/admin/MemberTable"

const dummyMembers = [
  { id: 1, name: "Sara Ali", email: "sara@example.com", role: "Member" },
  { id: 2, name: "Musa Bekele", email: "musa@example.com", role: "Admin" }
]

export default function ManageMembers() {
  const [members, setMembers] = useState(dummyMembers)

  const addMember = (newMember: any) => {
    setMembers([...members, { ...newMember, id: Date.now() }])
  }

  const editMember = (updated: any) => {
    setMembers(members.map((m) => m.id === updated.id ? updated : m))
  }

  const deleteMember = (id: number) => {
    setMembers(members.filter((m) => m.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Manage Members</h1>
        <MemberForm onSubmit={addMember} />
      </div>
      <MemberTable members={members} onEdit={editMember} onDelete={deleteMember} />
    </div>
  )
}
