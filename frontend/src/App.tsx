import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainLayout from './layouts/MainLayout'
import AdminLayout from './admin/layout/AdminLayout'
import Home from './pages/Home/Home'
import Players from "./pages/Players/Players"
import PlayerPage from "./pages/PlayerPage/PlayerPage"
import Login from "./admin/pages/Login/Login"
import ProtectedRoute from "./admin/routes/ProtectedRoute"
import AdminPlayers from "./admin/pages/Players/AdminPlayers"
import AdminPlayerPage from "./admin/pages/Players/AdminPlayerPage"
import NewsPage from "./admin/pages/News/NewsPage"
import SeasonsPage from "./admin/pages/Seasons/Seasons"
import CreatePlayer from "./admin/pages/CreatePlayer/CreatePlayer"
import CreateSeason from "./admin/pages/CreateSeason/CreateSeason"
import MediaLibraryPage from "./admin/pages/MediaLibrary/MediaLibraryPage"
import ClubTeams from "./admin/pages/ClubTeams/ClubTeams"
import Matches from "./admin/pages/Matches/Matches"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/players" element={<Players />} />
          <Route path="/players/:slug" element={<PlayerPage />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />
        
        <Route path="/admin" element={<ProtectedRoute> <AdminLayout /> </ProtectedRoute>}>
          <Route
            index
            element={<h1>Dashboard</h1>}
          />
          <Route
            path="media"
            element={<MediaLibraryPage />}
          />
          <Route
            path="players"
            element={<AdminPlayers />}
          />
          <Route
            path="players/:slug"
            element={<AdminPlayerPage />}
          />
          <Route
            path="players/create"
            element={<CreatePlayer />}
          />
          <Route
            path="seasons/create"
            element={<CreateSeason />}
          />
          <Route
            path="teams"
            element={<ClubTeams />}
          />
          <Route
            path="news"
            element={<NewsPage />}
          />
          <Route
            path="seasons"
            element={<SeasonsPage />}
          />
          <Route
            path="matches"
            element={<Matches />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App