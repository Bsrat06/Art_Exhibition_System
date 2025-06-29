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
    <aside className="w-64 bg-gray-100 dark:bg-gray-800 h-full p-4 shadow-sm border-r border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">🛠 Admin Panel</h2>
      <nav className="space-y-2">
        {links.map(link => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm transition-colors ${
                isActive 
                  ? "bg-primary text-gray-300" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}