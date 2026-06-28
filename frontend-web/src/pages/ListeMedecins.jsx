export default function ListeMedecins() {
  const medecins = [
    { nom: "Dr. Martin Sophie", specialite: "Médecin généraliste", ville: "Paris 8e", disponible: true, avatar: "MS" },
    { nom: "Dr. Leblanc Pierre", specialite: "Cardiologue", ville: "Paris 15e", disponible: true, avatar: "LP" },
    { nom: "Dr. Durand Claire", specialite: "Dermatologue", ville: "Paris 11e", disponible: false, avatar: "DC" },
    { nom: "Dr. Bernard Paul", specialite: "Pédiatre", ville: "Paris 6e", disponible: true, avatar: "BP" },
    { nom: "Dr. Rousseau Anne", specialite: "Ophtalmologue", ville: "Paris 17e", disponible: false, avatar: "RA" },
  ]

  const nav = [
    { label: "Dashboard" },
    { label: "Prise de RDV" },
    { label: "Agenda" },
    { label: "Médecins", active: true },
    { label: "Notifications" },
  ]

  return (
    <div className="flex min-h-screen bg-slate-100 text-gray-800">

      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col p-6 shadow-sm">
        <h1 className="text-xl font-bold text-blue-500 mb-10">MEDICA+</h1>
        <nav className="flex flex-col gap-1 flex-1">
          {nav.map((item) => (
            <button key={item.label}
              className={`text-left px-4 py-2.5 rounded-lg text-sm transition
                ${item.active
                  ? "bg-blue-500 text-white font-medium"
                  : "text-gray-500 hover:bg-slate-100 hover:text-gray-800"}`}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-gray-100 pt-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold text-white">
            IM
          </div>
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
          <p className="text-gray-400 text-sm mt-1">{medecins.length} médecins enregistrés</p>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Rechercher un médecin ou une spécialité..."
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm outline-none focus:border-blue-400"
          />
        </div>

        {/* Liste */}
        <div className="flex flex-col gap-3">
          {medecins.map((m, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm px-6 py-4 flex items-center gap-4">
              {/* Avatar */}
              <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600 flex-shrink-0">
                {m.avatar}
              </div>

              {/* Infos */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{m.nom}</p>
                <p className="text-xs text-gray-400">{m.specialite} · {m.ville}</p>
              </div>

              {/* Disponibilité */}
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                m.disponible
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-400"
              }`}>
                {m.disponible ? "Disponible" : "Indisponible"}
              </span>

              {/* Bouton */}
              <button className={`text-xs px-4 py-2 rounded-xl font-medium transition ${
                m.disponible
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
                disabled={!m.disponible}>
                Prendre RDV
              </button>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}