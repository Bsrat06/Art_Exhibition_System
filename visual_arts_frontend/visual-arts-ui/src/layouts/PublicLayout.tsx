import { Outlet } from "react-router-dom"
import VisitorNavbar from "../components/visitor/VisitorNavbar"

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <VisitorNavbar />
      <main className="flex-1 p-6 max-w-6xl mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
