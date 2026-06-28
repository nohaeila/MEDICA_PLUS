import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import ListeMedecins from "./pages/ListeMedecins"
import PriseRDV from "./pages/PriseRDV"
import Agenda from "./pages/Agenda"
import Notifications from "./pages/Notifications"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/medecins" element={<ListeMedecins />} />
        <Route path="/rdv" element={<PriseRDV />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App