import { Outlet } from "react-router-dom"
import MemberSidebar from "../components/member/MemberSidebar"
import Topbar from "../components/common/Topbar"

export default function MemberLayout() {
  return (
    <div className="flex min-h-screen">
      <MemberSidebar />
      <main className="flex-1 p-6 bg-gray-50">
        <Topbar />
        <Outlet />
      </main>
    </div>
  )
}
