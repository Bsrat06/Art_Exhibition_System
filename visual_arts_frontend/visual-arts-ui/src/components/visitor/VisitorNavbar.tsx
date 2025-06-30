import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import LogoutButton from "../../components/common/LogoutButton"
import { useTheme } from "../../context/ThemeProvider"
import { Moon, Sun, Menu } from "lucide-react"
import { cn } from "../../lib/utils"

export default function VisitorNavbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const navigate = useNavigate()

  const { theme, toggleTheme } = useTheme()

  const token = localStorage.getItem("token")
  const isAuthenticated = !!token

  const username = localStorage.getItem("username") || "Guest"
  const avatarUrl = localStorage.getItem("avatarUrl") || "https://via.placeholder.com/40"

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev)
  const toggleMobileMenu = () => setIsMobileOpen((prev) => !prev)

  useEffect(() => {
    const close = () => {
      setIsDropdownOpen(false)
      setIsMobileOpen(false)
    }
    window.addEventListener("click", close)
    return () => window.removeEventListener("click", close)
  }, [])

  return (
    <nav className="bg-background border-b shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center font-poppins">
        {/* Left Logo + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button onClick={toggleMobileMenu} className="sm:hidden text-muted-foreground">
            <Menu />
          </button>
          <Link to="/" className="text-xl font-bold text-primary">
            VisualArts
          </Link>
        </div>

        {/* Main Nav */}
        <ul
          className={cn(
            "hidden sm:flex space-x-6 text-sm font-medium",
            isMobileOpen && "absolute top-full left-0 right-0 bg-background p-4 flex flex-col gap-3 shadow"
          )}
        >
          <li><Link to="/" className="hover:text-primary">Home</Link></li>
          <li><Link to="/about" className="hover:text-primary">About</Link></li>
          <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          <li><Link to="/gallery" className="hover:text-primary">Gallery</Link></li>
          <li><Link to="/events" className="hover:text-primary">Events</Link></li>
          <li><Link to="/projects" className="hover:text-primary">Projects</Link></li>
        </ul>

        {/* Right User & Theme Actions */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* Authenticated User */}
          {isAuthenticated ? (
            <div className="relative z-20" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                className="flex items-center space-x-2"
                onClick={toggleDropdown}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarUrl} alt={username} />
                  <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">{username}</span>
              </Button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 animate-fadeIn">
                  <Link to="/member/profile" className="block px-4 py-2 text-sm hover:bg-accent">My Profile</Link>
                  <LogoutButton />
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
