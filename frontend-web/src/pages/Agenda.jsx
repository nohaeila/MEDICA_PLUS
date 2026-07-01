import { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import api from "../services/api"

export default function Agenda() {
  const [moisActuel, setMoisActuel] = useState(new Date())
  const [jourSelectionne, setJourSelectionne] = useState(null)
  const [rdvs, setRdvs] = useState([])
  const [loading, setLoading] = useState(true)

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

  const joursNoms = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
  const getNomMois = (date) => date.toLocaleString("fr-FR", { month: "long", year: "numeric" })

  useEffect(() => {
    api.get("/rdv").then(res => {
      setRdvs(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const getJoursDuMois = () => {
    const annee = moisActuel.getFullYear()
    const mois = moisActuel.getMonth()
    const premierJour = new Date(annee, mois, 1).getDay()
    const decalage = premierJour === 0 ? 6 : premierJour - 1
    const nbJours = new Date(annee, mois + 1, 0).getDate()
    const jours = []
    for (let i = 0; i < decalage; i++) jours.push(null)
    for (let i = 1; i <= nbJours; i++) jours.push(i)
    return jours
  }

  const getDateStr = (jour) => {
    if (!jour) return null
    const annee = moisActuel.getFullYear()
    const mois = String(moisActuel.getMonth() + 1).padStart(2, "0")
    return `${annee}-${mois}-${String(jour).padStart(2, "0")}`
  }

  const aRDV = (jour) => {
    const dateStr = getDateStr(jour)
    if (!dateStr) return false
    return rdvs.some(r => r.date?.startsWith(dateStr) && r.statut !== "ANNULE")
  }

  const aujourdhui = new Date()
  const estAujourdhui = (jour) => {
    return jour === aujourdhui.getDate() &&
      moisActuel.getMonth() === aujourdhui.getMonth() &&
      moisActuel.getFullYear() === aujourdhui.getFullYear()
  }

  const estSelectionne = (jour) => {
    if (!jourSelectionne || !jour) return false
    return jourSelectionne === getDateStr(jour)
  }

  const rdvsAffichés = jourSelectionne
    ? rdvs.filter(r => r.date?.startsWith(jourSelectionne) && r.statut !== "ANNULE")
    : rdvs.filter(r => new Date(r.date) >= new Date() && r.statut !== "ANNULE").slice(0, 5)

  return (
    <div className="flex min-h-screen" style={{ background: "#f0f4ff" }}>
      <Sidebar active="Agenda" />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold" style={{ color: "#1e293b" }}>Agenda</h2>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
            {rdvs.filter(r => r.statut !== "ANNULE").length} rendez-vous au total
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">

          {/* Calendrier */}
          <div className="p-6"
            style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => {
                  setMoisActuel(new Date(moisActuel.getFullYear(), moisActuel.getMonth() - 1, 1))
                  setJourSelectionne(null)
                }}
                className="w-8 h-8 flex items-center justify-center transition"
                style={{ borderRadius: 8, background: "#f0f4ff", color: "#4f8ef7", fontSize: 18 }}>
                ‹
              </button>
              <h3 className="text-sm font-semibold capitalize" style={{ color: "#1e293b" }}>
                {getNomMois(moisActuel)}
              </h3>
              <button
                onClick={() => {
                  setMoisActuel(new Date(moisActuel.getFullYear(), moisActuel.getMonth() + 1, 1))
                  setJourSelectionne(null)
                }}
                className="w-8 h-8 flex items-center justify-center transition"
                style={{ borderRadius: 8, background: "#f0f4ff", color: "#4f8ef7", fontSize: 18 }}>
                ›
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {joursNoms.map(j => (
                <div key={j} className="text-center text-xs font-medium py-1"
                  style={{ color: "#6b7280" }}>{j}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {getJoursDuMois().map((jour, i) => (
                <div key={i}
                  onClick={() => jour && setJourSelectionne(
                    jourSelectionne === getDateStr(jour) ? null : getDateStr(jour)
                  )}
                  className="relative flex items-center justify-center h-9 text-sm cursor-pointer transition"
                  style={{
                    borderRadius: 8,
                    background: estAujourdhui(jour)
                      ? "#4f8ef7"
                      : estSelectionne(jour)
                      ? "#e0ecff"
                      : "transparent",
                    color: estAujourdhui(jour)
                      ? "#ffffff"
                      : estSelectionne(jour)
                      ? "#4f8ef7"
                      : jour ? "#1e293b" : "transparent",
                    fontWeight: estAujourdhui(jour) || estSelectionne(jour) ? "bold" : "normal",
                  }}>
                  {jour}
                  {aRDV(jour) && !estAujourdhui(jour) && !estSelectionne(jour) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: "#4f8ef7" }}></span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RDV du jour sélectionné ou prochains RDV */}
          <div className="p-6"
            style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "#1e293b" }}>
              {jourSelectionne
                ? `Rendez-vous du ${new Date(jourSelectionne).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`
                : "Prochains rendez-vous"}
            </h3>

            {loading ? (
              <p className="text-center py-6" style={{ color: "#6b7280" }}>Chargement...</p>
            ) : rdvsAffichés.length === 0 ? (
              <p className="text-center py-6" style={{ color: "#6b7280" }}>
                {jourSelectionne ? "Aucun rendez-vous ce jour" : "Aucun rendez-vous à venir"}
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {rdvsAffichés.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3"
                    style={{ background: "#f0f4ff", borderRadius: 12 }}>
                    <div className="flex flex-col items-center px-2 py-1 w-12 flex-shrink-0"
                      style={{ background: "#e0ecff", borderRadius: 8 }}>
                      <span className="font-bold text-xs" style={{ color: "#4f8ef7" }}>
                        {new Date(r.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                      </span>
                      <span className="text-xs" style={{ color: "#4f8ef7" }}>{r.heure}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: "#1e293b" }}>
                        {r.patient?.prenom} {r.patient?.nom}
                      </p>
                      <p className="text-xs" style={{ color: "#6b7280" }}>{r.motif}</p>
                    </div>
                    <span className="text-xs px-2 py-1 font-medium"
                      style={{ borderRadius: 20, ...statutStyle[r.statut] }}>
                      {statutLabel[r.statut]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}