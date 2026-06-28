import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import api from "../services/api"

export default function MesPatients() {
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [recherche, setRecherche] = useState("")

  useEffect(() => {
    api.get("/medecins/1/patients")
      .then(res => { setPatients(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const patientsFiltres = patients.filter(p =>
    p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    p.prenom.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-slate-100 text-gray-800">
      <Sidebar active="Mes patients" />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Mes patients</h2>
          <p className="text-gray-400 text-sm mt-1">{patients.length} patient(s) enregistré(s)</p>
        </div>

        <div className="mb-6">
          <input type="text"
            placeholder="Rechercher un patient..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm outline-none focus:border-blue-400"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-10">Chargement...</div>
        ) : patientsFiltres.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-400">
            Aucun patient trouvé
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {patientsFiltres.map((p, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm px-6 py-4 flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600 flex-shrink-0">
                  {p.prenom[0]}{p.nom[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{p.prenom} {p.nom}</p>
                  <p className="text-xs text-gray-400">NSS : {p.nss}</p>
                </div>
                <button
                  onClick={() => navigate(`/consultation/${p.id}`)}
                  className="text-xs px-4 py-2 rounded-xl font-medium bg-blue-500 text-white hover:bg-blue-600 transition">
                  Voir le dossier
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}