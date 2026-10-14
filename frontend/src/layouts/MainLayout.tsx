import { Outlet } from "react-router-dom"

import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"

function MainLayout() {
  return (
    <div className="body">
      <Header />
      <div className="content">
        <main>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default MainLayout