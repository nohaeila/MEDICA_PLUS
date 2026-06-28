import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import api from "../services/api"

export default function ListeMedecins() {
  const navigate = useNavigate()
  const [medecins, setMedecins] = useState([])
  const [loading, setLoading] = useState(true)
  const [recherche, setRecherche] = useState("")

  useEffect(() => {
    api.get("/medecins")
      .then(res => { setMedecins(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const medecinsFiltres = medecins.filter(m =>
    m.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    m.specialite.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-slate-100 text-gray-800">
      <Sidebar active="Médecins" />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Liste des médecins</h2>
          <p className="text-gray-400 text-sm mt-1">{medecins.length} médecin(s) enregistré(s)</p>
        </div>

        <div className="mb-6">
          <input type="text"
            placeholder="Rechercher un médecin ou une spécialité..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm outline-none focus:border-blue-400"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-10">Chargement...</div>
        ) : medecinsFiltres.length === 0 ? (
          <div className="text-center text-gray-400 py-10">Aucun médecin trouvé</div>
        ) : (
          <div className="flex flex-col gap-3">
            {medecinsFiltres.map((m, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm px-6 py-4 flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600 flex-shrink-0">
                  {m.nom[0]}{m.prenom[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">Dr. {m.prenom} {m.nom}</p>
                  <p className="text-xs text-gray-400">{m.specialite} · {m.ville}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full font-medium bg-green-100 text-green-700">
                  Disponible
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}