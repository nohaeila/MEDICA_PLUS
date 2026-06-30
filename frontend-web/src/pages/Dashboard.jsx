import Sidebar from "../components/Sidebar"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const navigate = useNavigate()

  const rdv = [
    { heure: "08:30", patient: "Martin Alain", motif: "Consultation générale", statut: "Confirmé" },
    { heure: "09:15", patient: "Sophie Bernard", motif: "Suivi cardiologique", statut: "En attente" },
    { heure: "10:00", patient: "Lucas Klein", motif: "Urgence signalée", statut: "Urgent" },
    { heure: "11:30", patient: "Pauline Caron", motif: "Renouvellement ordonnance", statut: "Confirmé" },
    { heure: "14:00", patient: "Nadia Rousseau", motif: "Bilan annuel", statut: "Confirmé" },
  ]

  const stats = [
    { label: "RDV aujourd'hui", value: "5" },
    { label: "Patients suivis", value: "1" },
    { label: "RDV en attente", value: "1" },
  ]

  const statutStyle = {
    "Confirmé": { background: "#dcfce7", color: "#15803d" },
    "En attente": { background: "#ffedd5", color: "#c2410c" },
    "Urgent": { background: "#fee2e2", color: "#dc2626" },
  }

  return (
    <div className="flex min-h-screen" style={{ background: "#f0f4ff" }}>
      <Sidebar active="Dashboard" />

      <main className="flex-1 p-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm mb-1" style={{ color: "#6b7280" }}>Bonjour,</p>
          <h2 className="text-2xl font-bold" style={{ color: "#1e293b" }}>Dr. Ingrid M.</h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="p-5" style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <p className="text-3xl font-bold mb-1" style={{ color: "#4f8ef7" }}>{s.value}</p>
              <p className="text-sm" style={{ color: "#6b7280" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* RDV du jour */}
        <div className="p-6" style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold" style={{ color: "#1e293b" }}>RDV du jour</h3>
            <span className="text-sm" style={{ color: "#6b7280" }}>
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {rdv.map((r, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3"
                style={{ background: "#f0f4ff", borderRadius: 12 }}>

                <div className="flex items-center justify-center px-3 py-2 w-16 flex-shrink-0"
                  style={{ background: "#e0ecff", borderRadius: 10 }}>
                  <span className="font-bold text-sm" style={{ color: "#4f8ef7" }}>{r.heure}</span>
                </div>

                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: "#4f8ef7" }}>
                  {r.patient.split(" ").map(n => n[0]).join("")}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: "#1e293b" }}>{r.patient}</p>
                  <p className="text-xs" style={{ color: "#6b7280" }}>{r.motif}</p>
                </div>

                <span className="text-xs px-3 py-1 font-medium"
                  style={{ borderRadius: 20, ...statutStyle[r.statut] }}>
                  {r.statut}
                </span>

                <button
                  onClick={() => navigate("/gestion-rdv")}
                  className="text-xs px-3 py-1.5 font-medium transition"
                  style={{ background: "#4f8ef7", color: "#fff", borderRadius: 8 }}>
                  Voir
                </button>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}