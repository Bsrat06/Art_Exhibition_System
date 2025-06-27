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
    <aside className="w-60 bg-gray-100 h-full p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">🎨 Member Menu</h2>
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
