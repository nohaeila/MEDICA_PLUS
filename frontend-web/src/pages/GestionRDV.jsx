import { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import api from "../services/api"

export default function GestionRDV() {
  const [rdvs, setRdvs] = useState([])
  const [loading, setLoading] = useState(true)

  const statutStyle = {
    "CONFIRME": "bg-green-100 text-green-700",
    "EN_ATTENTE": "bg-orange-100 text-orange-600",
    "ANNULE": "bg-gray-100 text-gray-400",
    "URGENT": "bg-red-100 text-red-600",
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

  return (
    <div className="flex min-h-screen bg-slate-100 text-gray-800">
      <Sidebar active="Gestion des RDV" />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Gestion des rendez-vous</h2>
          <p className="text-gray-400 text-sm mt-1">{rdvs.length} rendez-vous au total</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-10">Chargement...</div>
        ) : rdvs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-400">
            Aucun rendez-vous pour le moment
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-col divide-y divide-gray-100">
              {rdvs.map((r, i) => (
                <div key={i} className="flex items-center gap-4 py-4">
                  <div className="flex flex-col items-center bg-blue-50 rounded-lg px-3 py-2 w-16 flex-shrink-0">
                    <span className="text-blue-500 font-bold text-xs">
                      {new Date(r.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                    </span>
                    <span className="text-blue-400 text-xs">{r.heure}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0">
                    {r.patient?.nom?.[0]}{r.patient?.prenom?.[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{r.patient?.prenom} {r.patient?.nom}</p>
                    <p className="text-xs text-gray-400">{r.motif}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statutStyle[r.statut]}`}>
                    {statutLabel[r.statut]}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => changerStatut(r.id, "CONFIRME")}
                      className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition">
                      Confirmer
                    </button>
                    <button onClick={() => changerStatut(r.id, "ANNULE")}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition">
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