import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import ListeMedecins from "./pages/ListeMedecins"
import Agenda from "./pages/Agenda"
import Notifications from "./pages/Notifications"
import GestionRDV from "./pages/GestionRDV"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page d'accueil */}
        <Route path="/" element={
          localStorage.getItem("token")
            ? <ProtectedRoute><Dashboard /></ProtectedRoute>
            : <Landing />
        } />

        {/* Pages publiques */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pages protégées */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/gestion-rdv" element={<ProtectedRoute><GestionRDV /></ProtectedRoute>} />
        <Route path="/agenda" element={<ProtectedRoute><Agenda /></ProtectedRoute>} />
        <Route path="/medecins" element={<ProtectedRoute><ListeMedecins /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App