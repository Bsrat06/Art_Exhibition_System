import { NavLink } from "react-router-dom"

const links = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Members", path: "/admin/members" },
  { name: "Artworks", path: "/admin/artworks" },
  { name: "Events", path: "/admin/events" },
  { name: "Projects", path: "/admin/projects" },
  { name: "Notifications", path: "/admin/notifications" },
  { name: "Reports", path: "/admin/reports" }
]

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-100 h-full p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">🛠 Admin Panel</h2>
      <nav className="space-y-2">
        {links.map(link => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm ${isActive ? "bg-primary text-white" : "hover:bg-gray-200"}`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
