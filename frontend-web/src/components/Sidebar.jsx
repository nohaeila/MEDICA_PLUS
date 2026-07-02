import { useNavigate } from "react-router-dom"

import { useState, useEffect } from "react"

import api from "../services/api"
 
export default function Sidebar({ active }) {

  const navigate = useNavigate()

  const [medecin, setMedecin] = useState(null)
 
  useEffect(() => {

    api.get("/medecins/profil")

      .then(res => setMedecin(res.data))

      .catch(() => {})

  }, [])
 
  const nav = [

    { label: "Dashboard", path: "/dashboard" },

    { label: "Mes RDV", path: "/gestion-rdv" },

    //{ label: "Mes patients", path: "/mes-patients" },

    { label: "Agenda", path: "/agenda" },

    { label: "Notifications", path: "/notifications" },

    { label: "Mon profil", path: "/profil" },

  ]
 
  const handleLogout = () => {

    localStorage.clear()

    window.location.href = "/"

  }
 
  const initiales = medecin

    ? `${medecin.prenom?.[0] || ""}${medecin.nom?.[0] || ""}`

    : "?"
 
  return (
<aside className="w-60 flex flex-col p-6 shadow-sm"

      style={{ background: "#ffffff", borderRight: "1px solid #e2e8f0" }}>
 
      <div className="flex items-center gap-2 mb-10">
<div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"

          style={{ background: "#4f8ef7" }}>+</div>
<h1 className="text-lg font-bold" style={{ color: "#4f8ef7" }}>MEDICA+</h1>
</div>
 
      <nav className="flex flex-col gap-1 flex-1">

        {nav.map((item) => (
<button key={item.label}

            onClick={() => navigate(item.path)}

            className="text-left px-4 py-2.5 text-sm transition font-medium"

            style={{

              borderRadius: 10,

              background: active === item.label ? "#4f8ef7" : "transparent",

              color: active === item.label ? "#ffffff" : "#6b7280",

            }}>

            {item.label}
</button>

        ))}
</nav>
 
      <div className="pt-5 flex items-center gap-3" style={{ borderTop: "1px solid #e2e8f0" }}>
<div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"

          style={{ background: "#4f8ef7" }}>

          {initiales}
</div>
<div>
<p className="text-sm font-medium" style={{ color: "#1e293b" }}>

            Dr. {medecin?.prenom} {medecin?.nom?.[0]}.
</p>
<p className="text-xs" style={{ color: "#6b7280" }}>

            {medecin?.specialite || "Médecin"}
</p>
</div>
</div>
 
      <button onClick={handleLogout}

        className="w-full text-left px-4 py-2.5 text-sm transition mt-3"

        style={{ borderRadius: 10, color: "#ef4444" }}>

        Déconnexion
</button>
</aside>

  )

}
 