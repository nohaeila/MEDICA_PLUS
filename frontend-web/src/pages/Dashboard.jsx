import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const navigate = useNavigate()
  const medecin = { nom: "Dr. Ingrid M.", specialite: "Médecin Généraliste", avatar: "IM" }

  const rdv = [
    { heure: "08:30", patient: "Martin Alain", motif: "Consultation générale", statut: "Confirmé" },
    { heure: "09:15", patient: "Sophie Bernard", motif: "Suivi cardiologique", statut: "En attente" },
    { heure: "10:00", patient: "Lucas Klein", motif: "Urgence signalée", statut: "Urgent" },
    { heure: "11:30", patient: "Pauline Caron", motif: "Renouvellement ordonnance", statut: "Confirmé" },
    { heure: "14:00", patient: "Nadia Rousseau", motif: "Bilan annuel", statut: "Confirmé" },
  ]

  const statutStyle = {
    "Confirmé": "bg-green-100 text-green-700",
    "En attente": "bg-orange-100 text-orange-600",
    "Urgent": "bg-red-100 text-red-600",
  }

  const nav = [
    { label: "Dashboard", path: "/", active: true },
    { label: "Prise de RDV", path: "/rdv" },
    { label: "Agenda", path: "/agenda" },
    { label: "Médecins", path: "/medecins" },
    { label: "Notifications", path: "/notifications" },
  ]

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
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            {medecin.avatar}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{medecin.nom}</p>
            <p className="text-xs text-gray-400">{medecin.specialite}</p>
          </div>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-8">
        <div className="mb-8">
          <p className="text-gray-400 text-sm">Bonjour,</p>
          <h2 className="text-2xl font-bold text-gray-800">{medecin.nom}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-gray-800">RDV du jour</h3>
            <span className="text-sm text-gray-400">Jeudi 18 Juin 2026</span>
          </div>

          <div className="flex flex-col gap-3">
            {rdv.map((r, i) => (
              <div key={i} className="flex items-center gap-4 bg-slate-50 rounded-xl px-5 py-3">
                <div className="flex items-center justify-center bg-blue-50 rounded-lg px-3 py-2 w-16 flex-shrink-0">
                  <span className="text-blue-500 font-bold text-sm">{r.heure}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0">
                  {r.patient.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{r.patient}</p>
                  <p className="text-xs text-gray-400">{r.motif}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statutStyle[r.statut]}`}>
                  {r.statut}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}