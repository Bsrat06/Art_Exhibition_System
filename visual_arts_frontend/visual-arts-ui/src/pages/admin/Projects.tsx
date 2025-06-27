import { useState } from "react"
import { ProjectCard } from "../../components/admin/ProjectCard"
import { ProjectForm } from "../../components/admin/ProjectForm"

const dummyMembers = [
  { id: 1, name: "Sara Ali" },
  { id: 2, name: "Musa Bekele" },
  { id: 3, name: "Liya Tesfaye" }
]

const initialProjects = [
  {
    id: 101,
    title: "Summer Exhibition",
    description: "Prepare digital banners, logistics, and artwork curation.",
    progress: 30,
    members: [1, 3]
  }
]

export default function ManageProjects() {
  const [projects, setProjects] = useState(initialProjects)

  const addProject = (p: any) => {
    setProjects([...projects, { ...p, members: [] }])
  }

  const editProject = (updated: any) => {
    setProjects(projects.map(p => p.id === updated.id ? { ...p, ...updated } : p))
  }

  const deleteProject = (id: number) => {
    setProjects(projects.filter(p => p.id !== id))
  }

  const assignMembers = (projectId: number, memberIds: number[]) => {
    setProjects(projects.map(p => p.id === projectId ? { ...p, members: memberIds } : p))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Manage Projects</h1>
        <ProjectForm onSubmit={addProject} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={editProject}
            onDelete={deleteProject}
            onAssign={assignMembers}
            allMembers={dummyMembers}
          />
        ))}
      </div>
    </div>
  )
}
