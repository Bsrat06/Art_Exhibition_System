import { ProjectPublicCard } from "../../components/visitor/ProjectPublicCard"

const projects = [
  {
    title: "Digital Exhibition",
    description: "Curating a full online exhibition from submissions.",
    progress: 80
  },
  {
    title: "Creative Mural",
    description: "A large collaborative mural project near the main entrance.",
    progress: 45
  },
  {
    title: "Animation Showcase",
    description: "Short animated films created by our members.",
    progress: 20
  }
]

export default function VisitorProjects() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Active Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <ProjectPublicCard key={idx} project={project} />
        ))}
      </div>
    </div>
  )
}
