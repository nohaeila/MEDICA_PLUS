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
    <div className="flex min-h-screen" style={{ background: "#f0f4ff" }}>
      <Sidebar active="Mes patients" />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold" style={{ color: "#1e293b" }}>Mes patients</h2>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>{patients.length} patient(s) enregistré(s)</p>
        </div>

        {/* Recherche */}
        <div className="mb-6">
          <input type="text"
            placeholder="Rechercher un patient..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full px-4 py-3 text-sm outline-none"
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              color: "#1e293b",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
            }}
          />
        </div>

        {loading ? (
          <div className="text-center py-10" style={{ color: "#6b7280" }}>Chargement...</div>
        ) : patientsFiltres.length === 0 ? (
          <div className="p-10 text-center" style={{ background: "#ffffff", borderRadius: 14, color: "#6b7280" }}>
            Aucun patient trouvé
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {patientsFiltres.map((p, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4"
                style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

                {/* Avatar */}
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: "#4f8ef7" }}>
                  {p.prenom[0]}{p.nom[0]}
                </div>

                {/* Infos */}
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: "#1e293b" }}>{p.prenom} {p.nom}</p>
                  <p className="text-xs" style={{ color: "#6b7280" }}>NSS : {p.nss}</p>
                </div>

                {/* Bouton */}
                <button onClick={() => navigate(`/consultation/${p.id}`)}
                  className="text-xs px-4 py-2 font-medium transition"
                  style={{ background: "#4f8ef7", color: "#ffffff", borderRadius: 10 }}>
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