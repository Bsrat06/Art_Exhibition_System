import { NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { Button } from "../../components/ui/button"
import { Menu, X } from "lucide-react"

export default function VisitorNavbar() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    navigate("/login")
  }

  const links = [
    { name: "Home", path: "/" },
    { name: "Gallery", path: "/gallery" },
    { name: "Events", path: "/events" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" }
  ]

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <NavLink to="/" className="text-lg font-bold">
          🎨 Visual Arts
        </NavLink>

        {/* Desktop Nav */}
        <nav className="space-x-4 hidden md:flex items-center">
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

          {!loading && user ? (
            <>
              <span className="text-sm text-muted-foreground">{user.first_name} ({user.role})</span>
              <Button size="sm" variant="outline" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-sm hover:underline">
                Login
              </NavLink>
              <NavLink to="/register" className="text-sm hover:underline">
                Register
              </NavLink>
            </>
          )}
        </nav>

        {/* Mobile toggle */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {links.map(link => (
            <NavLink
              key={link.name}
              to={link.path}
              className="block text-sm px-2 py-1 rounded hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
          {!loading && user ? (
            <>
              <p className="text-sm text-muted-foreground">
                {user.first_name} ({user.role})
              </p>
              <Button size="sm" variant="outline" className="w-full" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="block text-sm hover:underline" onClick={() => setOpen(false)}>
                Login
              </NavLink>
              <NavLink to="/register" className="block text-sm hover:underline" onClick={() => setOpen(false)}>
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  )
}
