import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { Button } from "../../components/ui/button"

const links = [
  { name: "Home", path: "/" },
  { name: "Gallery", path: "/gallery" },
  { name: "Events", path: "/events" },
  { name: "Projects", path: "/projects" },
  { name: "Contact", path: "/contact" }
]

export default function VisitorNavbar() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token")
      localStorage.removeItem("role")
      navigate("/login")
    } catch {
      console.warn("logout error")
    }
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <NavLink to="/" className="text-lg font-bold">🎨 Visual Arts</NavLink>

        <nav className="space-x-4 hidden md:block">
          {links.map(link => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `text-sm px-2 py-1 rounded ${isActive ? "bg-primary text-white" : "hover:bg-gray-200"}`
              }
            >
              {link.name}
            </NavLink>
          ))}
          {!loading && (
            user ? (
              <Button onClick={handleLogout} variant="outline" size="sm">Logout</Button>
            ) : (
              <>
                <NavLink to="/login" className="text-sm px-2 py-1 hover:underline">Login</NavLink>
                <NavLink to="/register" className="text-sm px-2 py-1 hover:underline">Register</NavLink>
              </>
            )
          )}
        </nav>
      </div>
    </header>
  )
}
