import { Outlet } from "react-router-dom"

import Sidebar from "../components/Sidebar/Sidebar"
import "./AdminLayout.css"


function AdminLayout() {
  return (
    <div className="admin-layout">

        <aside>
            <Sidebar />
        </aside>

        <main>
            <Outlet />
        </main>

    </div>
  )
}

export default AdminLayout