import { useEffect } from "react"
import { useNavigate, Outlet } from "react-router-dom"

export function RequireAuth({ allowedRoles }: { allowedRoles: string[] }) {
  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")
  const navigate = useNavigate()

  useEffect(() => {
    if (!token || !role || !allowedRoles.includes(role)) {
      navigate("/login")
    }
  }, [token, role, navigate, allowedRoles])

  return <Outlet />
}
