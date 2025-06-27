import { Outlet } from "react-router-dom"
import AdminSidebar from "../components/admin/AdminSidebar"

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}
