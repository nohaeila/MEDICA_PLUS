import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import ListeMedecins from "./pages/ListeMedecins"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/medecins" element={<ListeMedecins />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App