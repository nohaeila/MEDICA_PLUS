import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function Agenda() {
  const navigate = useNavigate()
  const [moisActuel, setMoisActuel] = useState(new Date(2026, 5, 1))

  const nav = [
    { label: "Dashboard", path: "/" },
    { label: "Prise de RDV", path: "/rdv" },
    { label: "Agenda", path: "/agenda", active: true },
    { label: "Médecins", path: "/medecins" },
    { label: "Notifications", path: "/notifications" },
  ]

  const rdv = [
    { date: "2026-06-18", heure: "08:30", patient: "Martin Alain", motif: "Consultation générale", statut: "Confirmé" },
    { date: "2026-06-18", heure: "10:00", patient: "Lucas Klein", motif: "Urgence signalée", statut: "Urgent" },
    { date: "2026-06-20", heure: "09:15", patient: "Sophie Bernard", motif: "Suivi cardiologique", statut: "Confirmé" },
    { date: "2026-06-23", heure: "14:00", patient: "Nadia Rousseau", motif: "Bilan annuel", statut: "Confirmé" },
    { date: "2026-06-25", heure: "11:30", patient: "Pauline Caron", motif: "Renouvellement ordonnance", statut: "En attente" },
  ]

  const statutStyle = {
    "Confirmé": "bg-green-100 text-green-700",
    "En attente": "bg-orange-100 text-orange-600",
    "Urgent": "bg-red-100 text-red-600",
  }

  const joursNoms = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

  const getNomMois = (date) => date.toLocaleString("fr-FR", { month: "long", year: "numeric" })

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

  const aRDV = (jour) => {
    if (!jour) return false
    const annee = moisActuel.getFullYear()
    const mois = String(moisActuel.getMonth() + 1).padStart(2, "0")
    const date = `${annee}-${mois}-${String(jour).padStart(2, "0")}`
    return rdv.some(r => r.date === date)
  }

  const aujourdhui = new Date()
  const estAujourdhui = (jour) => {
    return jour === aujourdhui.getDate() &&
      moisActuel.getMonth() === aujourdhui.getMonth() &&
      moisActuel.getFullYear() === aujourdhui.getFullYear()
  }

  const moisPrecedent = () => setMoisActuel(new Date(moisActuel.getFullYear(), moisActuel.getMonth() - 1, 1))
  const moisSuivant = () => setMoisActuel(new Date(moisActuel.getFullYear(), moisActuel.getMonth() + 1, 1))

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
          <h2 className="text-2xl font-bold text-gray-800">Agenda</h2>
          <p className="text-gray-400 text-sm mt-1">Gérez vos rendez-vous</p>
        </div>

        <div className="grid grid-cols-2 gap-6">

          {/* Calendrier */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <button onClick={moisPrecedent} className="text-gray-400 hover:text-gray-600 text-lg px-2">‹</button>
              <h3 className="text-sm font-semibold capitalize">{getNomMois(moisActuel)}</h3>
              <button onClick={moisSuivant} className="text-gray-400 hover:text-gray-600 text-lg px-2">›</button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {joursNoms.map(j => (
                <div key={j} className="text-center text-xs text-gray-400 font-medium py-1">{j}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {getJoursDuMois().map((jour, i) => (
                <div key={i} className={`relative flex items-center justify-center h-9 rounded-lg text-sm cursor-pointer transition
                  ${!jour ? "" :
                    estAujourdhui(jour) ? "bg-blue-500 text-white font-bold" :
                    "hover:bg-slate-100 text-gray-700"}`}>
                  {jour}
                  {aRDV(jour) && !estAujourdhui(jour) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400"></span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Liste RDV */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-sm font-semibold mb-4">Prochains rendez-vous</h3>
            <div className="flex flex-col gap-3">
              {rdv.map((r, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                  <div className="flex flex-col items-center bg-blue-50 rounded-lg px-2 py-1 w-12 flex-shrink-0">
                    <span className="text-blue-500 font-bold text-xs">{r.date.split("-")[2]}</span>
                    <span className="text-blue-400 text-xs">{r.heure}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{r.patient}</p>
                    <p className="text-xs text-gray-400">{r.motif}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statutStyle[r.statut]}`}>
                    {r.statut}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}