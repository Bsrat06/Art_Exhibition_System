import { Outlet } from "react-router-dom"
import MemberSidebar from "../components/member/MemberSidebar"

export default function MemberLayout() {
  return (
    <div className="flex min-h-screen">
      <MemberSidebar />
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}
