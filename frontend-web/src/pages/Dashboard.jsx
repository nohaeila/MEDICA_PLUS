import Sidebar from "../components/Sidebar"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import api from "../services/api"

export default function Dashboard() {
  const navigate = useNavigate()
  const [rdvs, setRdvs] = useState([])
  const [loading, setLoading] = useState(true)
  const [medecin, setMedecin] = useState({ prenom: "", nom: "" })

  const statutStyle = {
    "PLANIFIE": { background: "#e0ecff", color: "#4f8ef7" },
    "CONFIRME": { background: "#dcfce7", color: "#15803d" },
    "TERMINE": { background: "#f1f5f9", color: "#64748b" },
    "ANNULE": { background: "#fee2e2", color: "#dc2626" },
  }

  const statutLabel = {
    "PLANIFIE": "Planifié",
    "CONFIRME": "Confirmé",
    "TERMINE": "Terminé",
    "ANNULE": "Annulé",
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    api.get("/rdv", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const today = new Date().toDateString()
      const rdvAujourdhui = res.data.filter(r =>
        new Date(r.date).toDateString() === today
      )
      setRdvs(rdvAujourdhui)
      setLoading(false)

      // Récupérer infos médecin
      if (res.data.length > 0 && res.data[0].medecin) {
        setMedecin(res.data[0].medecin)
      }
    }).catch(() => setLoading(false))
  }, [])

  const rdvPlanifies = rdvs.filter(r => r.statut === "PLANIFIE").length
  const token = localStorage.getItem("token")

  const stats = [
    { label: "RDV aujourd'hui", value: rdvs.length.toString() },
    { label: "RDV planifiés", value: rdvPlanifies.toString() },
    { label: "RDV confirmés", value: rdvs.filter(r => r.statut === "CONFIRME").length.toString() },
  ]

  return (
    <div className="flex min-h-screen" style={{ background: "#f0f4ff" }}>
      <Sidebar active="Dashboard" />

      <main className="flex-1 p-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm mb-1" style={{ color: "#6b7280" }}>Bonjour,</p>
          <h2 className="text-2xl font-bold" style={{ color: "#1e293b" }}>
            Dr. {medecin.prenom} {medecin.nom}
          </h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="p-5"
              style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <p className="text-3xl font-bold mb-1" style={{ color: "#4f8ef7" }}>{s.value}</p>
              <p className="text-sm" style={{ color: "#6b7280" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* RDV du jour */}
        <div className="p-6"
          style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold" style={{ color: "#1e293b" }}>RDV du jour</h3>
            <span className="text-sm" style={{ color: "#6b7280" }}>
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>

          {loading ? (
            <p className="text-center py-6" style={{ color: "#6b7280" }}>Chargement...</p>
          ) : rdvs.length === 0 ? (
            <p className="text-center py-6" style={{ color: "#6b7280" }}>
              Aucun rendez-vous aujourd'hui
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {rdvs.map((r, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3"
                  style={{ background: "#f0f4ff", borderRadius: 12 }}>

                  <div className="flex items-center justify-center px-3 py-2 w-16 flex-shrink-0"
                    style={{ background: "#e0ecff", borderRadius: 10 }}>
                    <span className="font-bold text-sm" style={{ color: "#4f8ef7" }}>{r.heure}</span>
                  </div>

                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: "#4f8ef7" }}>
                    {r.patient?.prenom?.[0]}{r.patient?.nom?.[0]}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: "#1e293b" }}>
                      {r.patient?.prenom} {r.patient?.nom}
                    </p>
                    <p className="text-xs" style={{ color: "#6b7280" }}>{r.motif}</p>
                  </div>

                  <span className="text-xs px-3 py-1 font-medium"
                    style={{ borderRadius: 20, ...statutStyle[r.statut] }}>
                    {statutLabel[r.statut]}
                  </span>

                  <button onClick={() => navigate("/gestion-rdv")}
                    className="text-xs px-3 py-1.5 font-medium transition"
                    style={{ background: "#4f8ef7", color: "#fff", borderRadius: 8 }}>
                    Voir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}