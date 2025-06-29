import { NavLink } from "react-router-dom"

const links = [
  { name: "Dashboard", path: "/member/dashboard" },
  { name: "Portfolio", path: "/member/portfolio" },
  { name: "Events", path: "/member/events" },
  { name: "Projects", path: "/member/projects" },
  { name: "Notifications", path: "/member/notifications" },
  { name: "Settings", path: "/member/settings" },
  { name: "Profile", path: "/member/profile" }
]

export default function MemberSidebar() {
  return (
    <aside className="w-60 bg-gray-100 dark:bg-gray-800 h-full p-4 shadow-sm border-r border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">🎨 Member Menu</h2>
      <nav className="space-y-2">
        {links.map(link => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm transition-colors ${
                isActive 
                  ? "bg-primary text-white" 
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