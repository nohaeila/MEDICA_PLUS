import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import api from "../services/api"

export default function ListeMedecins() {
  const navigate = useNavigate()
  const [medecins, setMedecins] = useState([])
  const [loading, setLoading] = useState(true)
  const [recherche, setRecherche] = useState("")

  const nav = [
    { label: "Dashboard", path: "/" },
    { label: "Prise de RDV", path: "/rdv" },
    { label: "Agenda", path: "/agenda" },
    { label: "Médecins", path: "/medecins", active: true },
    { label: "Notifications", path: "/notifications" },
  ]

  useEffect(() => {
    api.get("/medecins")
      .then(res => {
        setMedecins(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const medecinsFiltres = medecins.filter(m =>
    m.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    m.specialite.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-slate-100 text-gray-800">

      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col p-6 shadow-sm">
        <h1 className="text-xl font-bold text-blue-500 mb-10">MEDICA+</h1>
        <nav className="flex flex-col gap-1 flex-1">
          {nav.map((item) => (
            <button key={item.label}
              onClick={() => navigate(item.path)}
              className={`text-left px-4 py-2.5 rounded-lg text-sm transition
                ${item.active
                  ? "bg-blue-500 text-white font-medium"
                  : "text-gray-500 hover:bg-slate-100 hover:text-gray-800"}`}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-gray-100 pt-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold text-white">IM</div>
          <div>
            <p className="text-sm font-medium text-gray-800">Dr. Ingrid M.</p>
            <p className="text-xs text-gray-400">Médecin Généraliste</p>
          </div>
        </div>
      </aside>

      {/* Contenu */}
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Liste des médecins</h2>
          <p className="text-gray-400 text-sm mt-1">{medecins.length} médecin(s) enregistré(s)</p>
        </div>

        <div className="mb-6">
          <input
            type="text"
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
                <button
                  onClick={() => navigate("/rdv")}
                  className="text-xs px-4 py-2 rounded-xl font-medium bg-blue-500 text-white hover:bg-blue-600 transition">
                  Prendre RDV
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}