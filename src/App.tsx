import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import AppShell from "@/components/AppShell"
import Discover from "@/pages/Discover"
import Likes from "@/pages/Likes"
import Settings from "@/pages/Settings"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Navigate to="/discover" replace />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/likes" element={<Likes />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  )
}
