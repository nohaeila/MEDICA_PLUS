import Sidebar from "../components/Sidebar"

import { useNavigate } from "react-router-dom"

import { useState, useEffect } from "react"

import api from "../services/api"
 
export default function Dashboard() {

  const navigate = useNavigate()

  const [rdvs, setRdvs] = useState([])

  const [allRdvs, setAllRdvs] = useState([])

  const [patients, setPatients] = useState([])

  const [notifications, setNotifications] = useState([])

  const [loading, setLoading] = useState(true)

  const [medecin, setMedecin] = useState({ prenom: "", nom: "", specialite: "" })
 
  const statutStyle = {

    "en_attente": { background: "#e0ecff", color: "#4f8ef7" },

    "confirme": { background: "#dcfce7", color: "#15803d" },

    "termine": { background: "#f1f5f9", color: "#64748b" },

    "annule": { background: "#fee2e2", color: "#dc2626" },

  }
 
  const statutLabel = {

    "en_attente": "En attente",

    "confirme": "Confirmé",

    "termine": "Terminé",

    "annule": "Annulé",

  }
 
  useEffect(() => {

    const token = localStorage.getItem("token")

    if (!token) return
 
    Promise.all([

      api.get("/rdv"),

      api.get("/medecins/profil"),

      api.get("/medecins/mes-patients"),

      api.get("/notifications"),

    ]).then(([rdvRes, medecinRes, patientsRes, notifRes]) => {

      const today = new Date().toISOString().split("T")[0]

      const rdvAujourdhui = rdvRes.data.filter(r => r.date === today)

      setRdvs(rdvAujourdhui)

      setAllRdvs(rdvRes.data)

      setMedecin(medecinRes.data)

      setPatients(patientsRes.data)

      setNotifications(notifRes.data.filter(n => !n.lu))

      setLoading(false)

    }).catch(() => setLoading(false))

  }, [])
 
  const rdvAVenir = allRdvs.filter(r =>

    r.statut === "en_attente" || r.statut === "confirme"

  ).length
 
  const stats = [

    { label: "RDV aujourd'hui", value: rdvs.length, color: "#4f8ef7", bg: "#e0ecff" },

    { label: "RDV à venir", value: rdvAVenir, color: "#15803d", bg: "#dcfce7" },

    { label: "Patients suivis", value: patients.length, color: "#7c3aed", bg: "#ede9fe" },

    { label: "Notifications", value: notifications.length, color: "#c2410c", bg: "#ffedd5" },

  ]
 
  const prochainRdv = allRdvs

    .filter(r => r.statut !== "annule" && r.statut !== "termine")

    .sort((a, b) => a.date.localeCompare(b.date) || a.heure.localeCompare(b.heure))[0]
 
  return (
<div className="flex min-h-screen" style={{ background: "#f0f4ff" }}>
<Sidebar active="Dashboard" />
 
      <main className="flex-1 p-8">
 
        {/* Header */}
<div className="flex items-center justify-between mb-8">
<div>
<p className="text-sm mb-1" style={{ color: "#6b7280" }}>

              {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
</p>
<h2 className="text-2xl font-bold" style={{ color: "#1e293b" }}>

              Bonjour, Dr. {medecin.prenom} {medecin.nom}
</h2>
<p className="text-sm mt-1" style={{ color: "#4f8ef7" }}>{medecin.specialite}</p>
</div>
<button onClick={() => navigate("/gestion-rdv")}

            className="px-5 py-2.5 text-sm font-medium text-white transition"

            style={{ background: "#4f8ef7", borderRadius: 12 }}>

            + Gérer les RDV
</button>
</div>
 
        {/* Stats */}
<div className="grid grid-cols-4 gap-4 mb-6">

          {stats.map((s, i) => (
<div key={i} className="p-5"

              style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
<div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"

                style={{ background: s.bg }}>
<span className="text-lg font-bold" style={{ color: s.color }}>{s.value}</span>
</div>
<p className="text-sm font-medium" style={{ color: "#1e293b" }}>{s.value}</p>
<p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{s.label}</p>
</div>

          ))}
</div>
 
        <div className="grid grid-cols-2 gap-6">
 
          {/* RDV du jour */}
<div className="p-6"

            style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
<div className="flex items-center justify-between mb-5">
<h3 className="text-base font-semibold" style={{ color: "#1e293b" }}>RDV du jour</h3>
<button onClick={() => navigate("/gestion-rdv")}

                className="text-xs font-medium" style={{ color: "#4f8ef7" }}>

                Voir tout →
</button>
</div>
 
            {loading ? (
<p className="text-center py-6" style={{ color: "#6b7280" }}>Chargement...</p>

            ) : rdvs.length === 0 ? (
<div className="text-center py-8">
<p className="text-sm" style={{ color: "#6b7280" }}>Aucun rendez-vous aujourd'hui</p>
<button onClick={() => navigate("/gestion-rdv")}

                  className="text-xs mt-3 px-4 py-2 font-medium text-white"

                  style={{ background: "#4f8ef7", borderRadius: 10 }}>

                  Voir l'agenda
</button>
</div>

            ) : (
<div className="flex flex-col gap-3">

                {rdvs.map((r, i) => (
<div key={i} className="flex items-center gap-3 px-4 py-3"

                    style={{ background: "#f0f4ff", borderRadius: 12 }}>
<div className="flex items-center justify-center w-14 flex-shrink-0 py-2"

                      style={{ background: "#e0ecff", borderRadius: 10 }}>
<span className="font-bold text-xs" style={{ color: "#4f8ef7" }}>{r.heure}</span>
</div>
<div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"

                      style={{ background: "#4f8ef7" }}>

                      {r.patient?.prenom?.[0]}{r.patient?.nom?.[0]}
</div>
<div className="flex-1 min-w-0">
<p className="text-sm font-medium truncate" style={{ color: "#1e293b" }}>

                        {r.patient?.prenom} {r.patient?.nom}
</p>
<p className="text-xs truncate" style={{ color: "#6b7280" }}>{r.motif}</p>
</div>
<span className="text-xs px-2 py-1 font-medium flex-shrink-0"

                      style={{ borderRadius: 20, ...statutStyle[r.statut] }}>

                      {statutLabel[r.statut]}
</span>
</div>

                ))}
</div>

            )}
</div>
 
          <div className="flex flex-col gap-6">
 
            {/* Prochain RDV */}
<div className="p-6"

              style={{ background: "#4f8ef7", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
<p className="text-xs font-medium mb-3" style={{ color: "#c8dcff" }}>PROCHAIN RENDEZ-VOUS</p>

              {prochainRdv ? (
<>
<div className="flex items-center gap-3 mb-3">
<div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"

                      style={{ background: "#3a7ae4", color: "#fff" }}>

                      {prochainRdv.patient?.prenom?.[0]}{prochainRdv.patient?.nom?.[0]}
</div>
<div>
<p className="text-sm font-bold text-white">

                        {prochainRdv.patient?.prenom} {prochainRdv.patient?.nom}
</p>
<p className="text-xs" style={{ color: "#c8dcff" }}>{prochainRdv.motif}</p>
</div>
</div>
<div className="flex items-center gap-4">
<span className="text-xs px-3 py-1.5 font-medium"

                      style={{ background: "#3a7ae4", color: "#fff", borderRadius: 10 }}>

                      📅 {prochainRdv.date}
</span>
<span className="text-xs px-3 py-1.5 font-medium"

                      style={{ background: "#3a7ae4", color: "#fff", borderRadius: 10 }}>

                      🕐 {prochainRdv.heure}
</span>
</div>
</>

              ) : (
<p className="text-sm" style={{ color: "#c8dcff" }}>Aucun RDV à venir</p>

              )}
</div>
 
            {/* Notifications récentes */}
<div className="p-6 flex-1"

              style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
<div className="flex items-center justify-between mb-4">
<h3 className="text-base font-semibold" style={{ color: "#1e293b" }}>

                  Notifications

                  {notifications.length > 0 && (
<span className="ml-2 text-xs px-2 py-0.5 font-bold text-white"

                      style={{ background: "#ef4444", borderRadius: 20 }}>

                      {notifications.length}
</span>

                  )}
</h3>
<button onClick={() => navigate("/notifications")}

                  className="text-xs font-medium" style={{ color: "#4f8ef7" }}>

                  Voir tout →
</button>
</div>

              {notifications.length === 0 ? (
<p className="text-sm" style={{ color: "#6b7280" }}>Aucune nouvelle notification</p>

              ) : (
<div className="flex flex-col gap-2">

                  {notifications.slice(0, 3).map((n, i) => (
<div key={i} className="flex items-start gap-3 px-3 py-2.5"

                      style={{ background: "#f0f4ff", borderRadius: 10 }}>
<span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"

                        style={{ background: "#4f8ef7" }}></span>
<p className="text-xs" style={{ color: "#1e293b" }}>{n.message}</p>
</div>

                  ))}
</div>

              )}
</div>
 
          </div>
</div>
 
      </main>
</div>

  )

}
 