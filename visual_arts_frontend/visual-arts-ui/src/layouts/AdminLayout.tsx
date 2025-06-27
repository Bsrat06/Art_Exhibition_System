import { Outlet } from "react-router-dom"
import AdminSidebar from "../components/admin/AdminSidebar"
import LogoutButton from "../components/common/LogoutButton"


export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 bg-gray-50">
        <div className="flex justify-end mb-4">
          <LogoutButton />
        </div>
        <Outlet />
      </main>
    </div>
  )
}
