import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function PriseRDV() {
  const navigate = useNavigate()
  const [etape, setEtape] = useState(1)
  const [selection, setSelection] = useState({ medecin: null, date: null, heure: null })

  const nav = [
    { label: "Dashboard", path: "/" },
    { label: "Prise de RDV", path: "/rdv", active: true },
    { label: "Agenda", path: "/agenda" },
    { label: "Médecins", path: "/medecins" },
    { label: "Notifications", path: "/notifications" },
  ]

  const medecins = [
    { nom: "Dr. Martin Sophie", specialite: "Médecin généraliste", ville: "Paris 8e", avatar: "MS" },
    { nom: "Dr. Leblanc Pierre", specialite: "Cardiologue", ville: "Paris 15e", avatar: "LP" },
    { nom: "Dr. Bernard Paul", specialite: "Pédiatre", ville: "Paris 6e", avatar: "BP" },
  ]

  const creneaux = ["08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "15:30"]

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
          <h2 className="text-2xl font-bold text-gray-800">Prise de rendez-vous</h2>
          <p className="text-gray-400 text-sm mt-1">Réservez un créneau en 3 étapes</p>
        </div>

        {/* Indicateur d'étapes */}
        <div className="flex items-center gap-3 mb-8">
          {["Choisir un médecin", "Choisir une date", "Confirmer"].map((label, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                etape === i + 1 ? "bg-blue-500 text-white" :
                etape > i + 1 ? "bg-green-100 text-green-700" :
                "bg-white text-gray-400 border border-gray-200"
              }`}>
                <span>{etape > i + 1 ? "✓" : i + 1}</span>
                {label}
              </div>
              {i < 2 && <span className="text-gray-300">→</span>}
            </div>
          ))}
        </div>

        {/* Étape 1 — Choisir médecin */}
        {etape === 1 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-base font-semibold mb-4">Sélectionnez un médecin</h3>
            <div className="flex flex-col gap-3">
              {medecins.map((m, i) => (
                <div key={i}
                  onClick={() => setSelection({ ...selection, medecin: m })}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                    selection.medecin?.nom === m.nom
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-100 hover:border-blue-200"
                  }`}>
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                    {m.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{m.nom}</p>
                    <p className="text-xs text-gray-400">{m.specialite} · {m.ville}</p>
                  </div>
                  {selection.medecin?.nom === m.nom && (
                    <span className="text-blue-500 font-bold">✓</span>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => selection.medecin && setEtape(2)}
              className={`mt-6 w-full py-3 rounded-xl text-sm font-medium transition ${
                selection.medecin ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}>
              Continuer
            </button>
          </div>
        )}

        {/* Étape 2 — Choisir date et créneau */}
        {etape === 2 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-base font-semibold mb-4">Choisissez une date et un créneau</h3>

            <div className="mb-6">
              <label className="text-sm text-gray-500 mb-2 block">Date</label>
              <input
                type="date"
                onChange={(e) => setSelection({ ...selection, date: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-3 block">Créneau disponible</label>
              <div className="grid grid-cols-5 gap-2">
                {creneaux.map((h, i) => (
                  <button key={i}
                    onClick={() => setSelection({ ...selection, heure: h })}
                    className={`py-2 rounded-lg text-sm font-medium transition border ${
                      selection.heure === h
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                    }`}>
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setEtape(1)}
                className="flex-1 py-3 rounded-xl text-sm font-medium border border-gray-200 text-gray-500 hover:bg-slate-50">
                Retour
              </button>
              <button
                onClick={() => selection.date && selection.heure && setEtape(3)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition ${
                  selection.date && selection.heure ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}>
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Étape 3 — Confirmation */}
        {etape === 3 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-base font-semibold mb-6">Confirmation du rendez-vous</h3>

            <div className="bg-slate-50 rounded-xl p-5 flex flex-col gap-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Médecin</span>
                <span className="font-medium">{selection.medecin?.nom}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Spécialité</span>
                <span className="font-medium">{selection.medecin?.specialite}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Date</span>
                <span className="font-medium">{selection.date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Heure</span>
                <span className="font-medium">{selection.heure}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Lieu</span>
                <span className="font-medium">{selection.medecin?.ville}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setEtape(2)}
                className="flex-1 py-3 rounded-xl text-sm font-medium border border-gray-200 text-gray-500 hover:bg-slate-50">
                Retour
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 py-3 rounded-xl text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition">
                Confirmer le RDV
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}