import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import ListeMedecins from "./pages/ListeMedecins"
import Agenda from "./pages/Agenda"
import Notifications from "./pages/Notifications"
import GestionRDV from "./pages/GestionRDV"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/medecins" element={<ListeMedecins />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/gestion-rdv" element={<GestionRDV />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App