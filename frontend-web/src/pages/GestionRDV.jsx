import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import api from "../services/api"

export default function GestionRDV() {
  const navigate = useNavigate()
  const [rdvs, setRdvs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtre, setFiltre] = useState("tous")

  const statutStyle = {
    "CONFIRME": { background: "#dcfce7", color: "#15803d" },
    "EN_ATTENTE": { background: "#ffedd5", color: "#c2410c" },
    "ANNULE": { background: "#f1f5f9", color: "#94a3b8" },
    "URGENT": { background: "#fee2e2", color: "#dc2626" },
  }

  const statutLabel = {
    "CONFIRME": "Confirmé",
    "EN_ATTENTE": "En attente",
    "ANNULE": "Annulé",
    "URGENT": "Urgent",
  }

  useEffect(() => {
    api.get("/rdv/1")
      .then(res => { setRdvs(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const changerStatut = async (id, statut) => {
    try {
      await api.put(`/rdv/${id}`, { statut })
      setRdvs(rdvs.map(r => r.id === id ? { ...r, statut } : r))
    } catch (err) {
      console.error(err)
    }
  }

  const rdvFiltres = rdvs.filter(r => {
    if (filtre === "tous") return true
    if (filtre === "avenir") return new Date(r.date) >= new Date()
    if (filtre === "passes") return new Date(r.date) < new Date()
    return true
  })

  return (
    <div className="flex min-h-screen" style={{ background: "#f0f4ff" }}>
      <Sidebar active="Mes RDV" />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold" style={{ color: "#1e293b" }}>Mes rendez-vous</h2>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>{rdvs.length} rendez-vous au total</p>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "tous", label: "Tous" },
            { id: "avenir", label: "À venir" },
            { id: "passes", label: "Passés" },
          ].map(f => (
            <button key={f.id} onClick={() => setFiltre(f.id)}
              className="px-4 py-2 text-sm font-medium transition"
              style={{
                borderRadius: 10,
                background: filtre === f.id ? "#4f8ef7" : "#ffffff",
                color: filtre === f.id ? "#ffffff" : "#6b7280",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
              }}>
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-10" style={{ color: "#6b7280" }}>Chargement...</div>
        ) : rdvFiltres.length === 0 ? (
          <div className="p-10 text-center" style={{ background: "#ffffff", borderRadius: 14, color: "#6b7280" }}>
            Aucun rendez-vous
          </div>
        ) : (
          <div className="p-6" style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div className="flex flex-col" style={{ gap: 0 }}>
              {rdvFiltres.map((r, i) => (
                <div key={i} className="flex items-center gap-4 py-4"
                  style={{ borderBottom: i < rdvFiltres.length - 1 ? "1px solid #e2e8f0" : "none" }}>

                  {/* Date */}
                  <div className="flex flex-col items-center px-3 py-2 w-16 flex-shrink-0"
                    style={{ background: "#e0ecff", borderRadius: 10 }}>
                    <span className="font-bold text-xs" style={{ color: "#4f8ef7" }}>
                      {new Date(r.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                    </span>
                    <span className="text-xs" style={{ color: "#4f8ef7" }}>{r.heure}</span>
                  </div>

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: "#4f8ef7" }}>
                    {r.patient?.nom?.[0]}{r.patient?.prenom?.[0]}
                  </div>

                  {/* Infos */}
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: "#1e293b" }}>
                      {r.patient?.prenom} {r.patient?.nom}
                    </p>
                    <p className="text-xs" style={{ color: "#6b7280" }}>{r.motif}</p>
                  </div>

                  {/* Statut */}
                  <span className="text-xs px-3 py-1 font-medium"
                    style={{ borderRadius: 20, ...statutStyle[r.statut] }}>
                    {statutLabel[r.statut]}
                  </span>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/consultation/${r.patientId}`)}
                      className="text-xs px-3 py-1.5 font-medium transition"
                      style={{ background: "#e0ecff", color: "#4f8ef7", borderRadius: 8 }}>
                      Dossier
                    </button>
                    <button onClick={() => changerStatut(r.id, "CONFIRME")}
                      className="text-xs px-3 py-1.5 font-medium transition"
                      style={{ background: "#dcfce7", color: "#15803d", borderRadius: 8 }}>
                      Confirmer
                    </button>
                    <button onClick={() => changerStatut(r.id, "ANNULE")}
                      className="text-xs px-3 py-1.5 font-medium transition"
                      style={{ background: "#fee2e2", color: "#dc2626", borderRadius: 8 }}>
                      Annuler
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}