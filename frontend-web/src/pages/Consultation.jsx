import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import api from "../services/api"

export default function Consultation() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [rdvs, setRdvs] = useState([])
  const [ordonnances, setOrdonnances] = useState([])
  const [rapports, setRapports] = useState([])
  const [onglet, setOnglet] = useState("dossier")

  const [ordonnanceForm, setOrdonnanceForm] = useState({
    medicament: "", posologie: "", duree: "", notes: ""
  })
  const [rapportForm, setRapportForm] = useState({ contenu: "" })
  const [success, setSuccess] = useState("")

  useEffect(() => {
    // Récupérer les infos patient via ses RDV
    api.get(`/rdv/1`).then(res => {
      const rdvPatient = res.data.filter(r => r.patientId === parseInt(patientId))
      setRdvs(rdvPatient)
      if (rdvPatient.length > 0) setPatient(rdvPatient[0].patient)
    })
    api.get(`/ordonnances/${patientId}`).then(res => setOrdonnances(res.data))
    api.get(`/rapports/${patientId}`).then(res => setRapports(res.data))
  }, [patientId])

  const soumettreOrdonnance = async () => {
    try {
      await api.post("/ordonnances", {
        ...ordonnanceForm,
        medecinId: 1,
        patientId: parseInt(patientId)
      })
      setSuccess("Ordonnance créée avec succès !")
      setOrdonnanceForm({ medicament: "", posologie: "", duree: "", notes: "" })
      const res = await api.get(`/ordonnances/${patientId}`)
      setOrdonnances(res.data)
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error(err)
    }
  }

  const soumettreRapport = async () => {
    try {
      await api.post("/rapports", {
        contenu: rapportForm.contenu,
        medecinId: 1,
        patientId: parseInt(patientId)
      })
      setSuccess("Rapport enregistré avec succès !")
      setRapportForm({ contenu: "" })
      const res = await api.get(`/rapports/${patientId}`)
      setRapports(res.data)
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error(err)
    }
  }

  const statutStyle = {
    "CONFIRME": "bg-green-100 text-green-700",
    "EN_ATTENTE": "bg-orange-100 text-orange-600",
    "ANNULE": "bg-gray-100 text-gray-400",
    "URGENT": "bg-red-100 text-red-600",
  }

  const statutLabel = {
    "CONFIRME": "Confirmé", "EN_ATTENTE": "En attente",
    "ANNULE": "Annulé", "URGENT": "Urgent"
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-gray-800">
      <Sidebar active="Mes patients" />

      <main className="flex-1 p-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate("/mes-patients")}
            className="text-gray-400 hover:text-gray-600 text-sm">
            ← Retour
          </button>
          {patient && (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                {patient.prenom[0]}{patient.nom[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{patient.prenom} {patient.nom}</h2>
                <p className="text-xs text-gray-400">NSS : {patient.nss}</p>
              </div>
            </div>
          )}
        </div>

        {success && (
          <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-xl mb-4">
            {success}
          </div>
        )}

        {/* Onglets */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "dossier", label: "Dossier médical" },
            { id: "ordonnance", label: "Nouvelle ordonnance" },
            { id: "rapport", label: "Nouveau rapport" },
          ].map(o => (
            <button key={o.id} onClick={() => setOnglet(o.id)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
                onglet === o.id
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-500 hover:bg-slate-50"
              }`}>
              {o.label}
            </button>
          ))}
        </div>

        {/* Onglet Dossier */}
        {onglet === "dossier" && (
          <div className="flex flex-col gap-6">

            {/* RDV */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-base font-semibold mb-4">Rendez-vous</h3>
              {rdvs.length === 0 ? (
                <p className="text-gray-400 text-sm">Aucun rendez-vous</p>
              ) : (
                <div className="flex flex-col divide-y divide-gray-100">
                  {rdvs.map((r, i) => (
                    <div key={i} className="flex items-center gap-4 py-3">
                      <div className="flex flex-col items-center bg-blue-50 rounded-lg px-3 py-2 w-16 flex-shrink-0">
                        <span className="text-blue-500 font-bold text-xs">
                          {new Date(r.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                        </span>
                        <span className="text-blue-400 text-xs">{r.heure}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{r.motif}</p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${statutStyle[r.statut]}`}>
                        {statutLabel[r.statut]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ordonnances */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-base font-semibold mb-4">Ordonnances</h3>
              {ordonnances.length === 0 ? (
                <p className="text-gray-400 text-sm">Aucune ordonnance</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {ordonnances.map((o, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl px-4 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-gray-800">{o.medicament}</p>
                        <span className="text-xs text-gray-400">
                          {new Date(o.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Posologie : {o.posologie}</p>
                      <p className="text-xs text-gray-500">Durée : {o.duree}</p>
                      {o.notes && <p className="text-xs text-gray-400 mt-1">{o.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rapports */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-base font-semibold mb-4">Rapports médicaux</h3>
              {rapports.length === 0 ? (
                <p className="text-gray-400 text-sm">Aucun rapport</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {rapports.map((r, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl px-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-gray-400">
                          {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700">{r.contenu}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Onglet Ordonnance */}
        {onglet === "ordonnance" && (
          <div className="bg-white rounded-2xl shadow-sm p-6 max-w-2xl">
            <h3 className="text-base font-semibold mb-6">Rédiger une ordonnance</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                  Médicament
                </label>
                <input value={ordonnanceForm.medicament}
                  onChange={e => setOrdonnanceForm({ ...ordonnanceForm, medicament: e.target.value })}
                  placeholder="Ex: Doliprane 1000mg"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                  Posologie
                </label>
                <input value={ordonnanceForm.posologie}
                  onChange={e => setOrdonnanceForm({ ...ordonnanceForm, posologie: e.target.value })}
                  placeholder="Ex: 1 comprimé 3 fois par jour"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                  Durée
                </label>
                <input value={ordonnanceForm.duree}
                  onChange={e => setOrdonnanceForm({ ...ordonnanceForm, duree: e.target.value })}
                  placeholder="Ex: 7 jours"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                  Notes (optionnel)
                </label>
                <textarea value={ordonnanceForm.notes}
                  onChange={e => setOrdonnanceForm({ ...ordonnanceForm, notes: e.target.value })}
                  placeholder="Instructions supplémentaires..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 resize-none" />
              </div>
              <button onClick={soumettreOrdonnance}
                className="w-full bg-blue-500 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-600 transition">
                Enregistrer l'ordonnance
              </button>
            </div>
          </div>
        )}

        {/* Onglet Rapport */}
        {onglet === "rapport" && (
          <div className="bg-white rounded-2xl shadow-sm p-6 max-w-2xl">
            <h3 className="text-base font-semibold mb-6">Rédiger un rapport médical</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                  Contenu du rapport
                </label>
                <textarea value={rapportForm.contenu}
                  onChange={e => setRapportForm({ contenu: e.target.value })}
                  placeholder="Décrivez l'état du patient, les observations, les recommandations..."
                  rows={8}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 resize-none" />
              </div>
              <button onClick={soumettreRapport}
                className="w-full bg-blue-500 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-600 transition">
                Enregistrer le rapport
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}