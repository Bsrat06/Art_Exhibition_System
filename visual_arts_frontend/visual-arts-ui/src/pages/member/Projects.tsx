import { useState } from "react"
import { ProjectCard } from "../../components/member/ProjectCard"

const availableProjects = [
  {
    id: 1,
    title: "Mural Collab",
    description: "Large mural painting project on campus walls.",
    progress: 45
  },
  {
    id: 2,
    title: "Exhibition Prep",
    description: "Preparing promotional artwork and posters.",
    progress: 70
  },
  {
    id: 3,
    title: "Street Art Tour",
    description: "Organizing an outdoor graffiti showcase.",
    progress: 20
  }
]

export default function MemberProjects() {
  const [joinedIds, setJoinedIds] = useState<number[]>([1]) // Assume member has joined Project 1

  const toggleParticipation = (id: number) => {
    const isJoined = joinedIds.includes(id)
    setJoinedIds(isJoined ? joinedIds.filter(pid => pid !== id) : [...joinedIds, id])
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Available Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableProjects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            joined={joinedIds.includes(project.id)}
            onToggle={toggleParticipation}
          />
        ))}
      </div>
    </div>
  )
}
