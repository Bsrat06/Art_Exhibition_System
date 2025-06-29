import { Outlet } from "react-router-dom"
import MemberSidebar from "../components/member/MemberSidebar"
import NotificationBell from "../components/common/NotificationBell"
import LogoutButton from "../components/common/LogoutButton"

export default function MemberLayout() {
  return (
    <div className="flex min-h-screen">
      <MemberSidebar />
      <main className="flex-1 p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Member Dashboard</h1>
          <div className="flex gap-4 items-center">
            <NotificationBell />
            <LogoutButton />
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  )
}

