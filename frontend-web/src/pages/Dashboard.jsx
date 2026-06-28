export default function Dashboard() {
  const medecin = { nom: "Dr. Ingrid M.", specialite: "Médecin Généraliste", avatar: "IM" }

  const rdv = [
    { heure: "08:30", patient: "Martin Alain", motif: "Consultation générale", statut: "Confirmé" },
    { heure: "09:15", patient: "Sophie Bernard", motif: "Suivi cardiologique", statut: "En attente" },
    { heure: "10:00", patient: "Lucas Klein", motif: "Urgence signalée", statut: "Urgent" },
    { heure: "11:30", patient: "Pauline Caron", motif: "Renouvellement ordonnance", statut: "Confirmé" },
    { heure: "14:00", patient: "Nadia Rousseau", motif: "Bilan annuel", statut: "Confirmé" },
  ]

  const statutStyle = {
    "Confirmé": "bg-green-900 text-green-300",
    "En attente": "bg-yellow-900 text-yellow-300",
    "Urgent": "bg-red-900 text-red-300",
  }

  const nav = [
    { label: "Dashboard", active: true },
    { label: "Prise de RDV" },
    { label: "Agenda" },
    { label: "Médecins" },
    { label: "Notifications" },
  ]

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">

      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col p-6">
        <h1 className="text-xl font-bold text-blue-400 mb-10">MEDICA+</h1>

        <nav className="flex flex-col gap-1 flex-1">
          {nav.map((item) => (
            <button key={item.label}
              className={`text-left px-4 py-2.5 rounded-lg text-sm transition
                ${item.active
                  ? "bg-blue-600 text-white font-medium"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-gray-800 pt-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
            {medecin.avatar}
          </div>
          <div>
            <p className="text-sm font-medium">{medecin.nom}</p>
            <p className="text-xs text-gray-400">{medecin.specialite}</p>
          </div>
        </div>
      </aside>

      {/* Contenu */}
      <main className="flex-1 p-8">

        {/* Bonjour */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold">Bonjour, {medecin.nom}</h2>
          <p className="text-gray-400 text-sm mt-1">
            Vous avez <span className="text-white font-medium">9 rendez-vous</span> aujourd'hui · Jeudi 18 Juin 2026
          </p>
        </div>

        {/* RDV du jour */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-base font-semibold mb-5">RDV du jour</h3>
          <div className="flex flex-col divide-y divide-gray-800">
            {rdv.map((r, i) => (
              <div key={i} className="flex items-center gap-4 py-4">
                <span className="text-blue-400 font-mono text-sm w-12 flex-shrink-0">
                  {r.heure}
                </span>
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {r.patient.split(" ").map(n => n[0]).join("")}
                </div>
                <span className="flex-1 text-sm font-medium">{r.patient}</span>
                <span className="flex-1 text-sm text-gray-400">{r.motif}</span>
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