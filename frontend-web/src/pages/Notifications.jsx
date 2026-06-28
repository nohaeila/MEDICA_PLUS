import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function Notifications() {
  const navigate = useNavigate()

  const nav = [
    { label: "Dashboard", path: "/" },
    { label: "Prise de RDV", path: "/rdv" },
    { label: "Agenda", path: "/agenda" },
    { label: "Médecins", path: "/medecins" },
    { label: "Notifications", path: "/notifications", active: true },
  ]

  const [notifications, setNotifications] = useState([
    { id: 1, titre: "Nouveau RDV confirmé", message: "Martin Alain a confirmé son RDV du 18 Juin à 08h30", heure: "Il y a 10 min", lu: false, type: "rdv" },
    { id: 2, titre: "RDV annulé", message: "Sophie Bernard a annulé son RDV du 20 Juin à 09h15", heure: "Il y a 1h", lu: false, type: "annulation" },
    { id: 3, titre: "Urgence signalée", message: "Lucas Klein a signalé une urgence pour son RDV de 10h00", heure: "Il y a 2h", lu: false, type: "urgent" },
    { id: 4, titre: "Nouveau RDV confirmé", message: "Nadia Rousseau a confirmé son RDV du 23 Juin à 14h00", heure: "Hier", lu: true, type: "rdv" },
    { id: 5, titre: "Rappel RDV", message: "Rappel : vous avez 5 rendez-vous demain", heure: "Hier", lu: true, type: "rappel" },
  ])

  const typeStyle = {
    rdv: "bg-green-100 text-green-600",
    annulation: "bg-orange-100 text-orange-600",
    urgent: "bg-red-100 text-red-600",
    rappel: "bg-blue-100 text-blue-600",
  }

  const typeIcon = {
    rdv: "✓",
    annulation: "✕",
    urgent: "!",
    rappel: "◷",
  }

  const marquerLu = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, lu: true } : n))
  }

  const toutMarquerLu = () => {
    setNotifications(notifications.map(n => ({ ...n, lu: true })))
  }

  const nonLues = notifications.filter(n => !n.lu).length

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
            <p className="text-gray-400 text-sm mt-1">
              {nonLues > 0 ? `${nonLues} non lue${nonLues > 1 ? "s" : ""}` : "Tout est à jour"}
            </p>
          </div>
          {nonLues > 0 && (
            <button onClick={toutMarquerLu}
              className="text-sm text-blue-500 hover:text-blue-600 font-medium">
              Tout marquer comme lu
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
          {notifications.map((n) => (
            <div key={n.id}
              onClick={() => marquerLu(n.id)}
              className={`flex items-start gap-4 px-6 py-4 cursor-pointer hover:bg-slate-50 transition ${!n.lu ? "bg-blue-50/30" : ""}`}>

              {/* Icône type */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5 ${typeStyle[n.type]}`}>
                {typeIcon[n.type]}
              </div>

              {/* Contenu */}
              <div className="flex-1">
                <p className={`text-sm font-medium ${!n.lu ? "text-gray-900" : "text-gray-600"}`}>
                  {n.titre}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{n.message}</p>
              </div>

              {/* Heure + point non lu */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className="text-xs text-gray-400">{n.heure}</span>
                {!n.lu && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}