import { Outlet } from "react-router-dom"
import AdminSidebar from "../components/admin/AdminSidebar"
import NotificationBell from "../components/common/NotificationBell"
import LogoutButton from "../components/common/LogoutButton"
import ThemeToggle from "../components/common/ThemeToggle"


export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
          <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <div className="flex gap-4 items-center">
            <ThemeToggle/>
            <NotificationBell />
            <LogoutButton />
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  )
}

