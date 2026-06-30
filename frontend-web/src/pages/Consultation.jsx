import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import api from "../services/api"

export default function Consultation() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [rdvs, setRdvs] = useState([])
  const [dossier, setDossier] = useState(null)
  const [ordonnances, setOrdonnances] = useState([])
  const [onglet, setOnglet] = useState("dossier")

  const [notesForm, setNotesForm] = useState("")
  const [ordonnanceForm, setOrdonnanceForm] = useState({ contenu: "" })
  const [success, setSuccess] = useState("")

  useEffect(() => {
    api.get(`/rdv/1`).then(res => {
      const rdvPatient = res.data.filter(r => r.patientId === parseInt(patientId))
      setRdvs(rdvPatient)
      if (rdvPatient.length > 0) setPatient(rdvPatient[0].patient)
    })

    api.get(`/dossier/patient/${patientId}`).then(res => {
      setDossier(res.data)
      setNotesForm(res.data?.notes || "")
    })

    api.get(`/ordonnances/${patientId}`).then(res => setOrdonnances(res.data))
  }, [patientId])

  const enregistrerNotes = async () => {
    try {
      await api.put(`/dossier/patient/${patientId}/notes`, { notes: notesForm })
      setDossier({ ...dossier, notes: notesForm })
      setSuccess("Notes enregistrées avec succès !")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error(err)
    }
  }

  const soumettreOrdonnance = async () => {
    try {
      await api.post("/ordonnances", {
        contenu: ordonnanceForm.contenu,
        date: new Date().toISOString(),
        medecinId: 1,
        patientId: parseInt(patientId)
      })
      setSuccess("Ordonnance créée avec succès !")
      setOrdonnanceForm({ contenu: "" })
      const res = await api.get(`/ordonnances/${patientId}`)
      setOrdonnances(res.data)
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error(err)
    }
  }

  const statutStyle = {
    "CONFIRME": { background: "#dcfce7", color: "#15803d" },
    "EN_ATTENTE": { background: "#ffedd5", color: "#c2410c" },
    "ANNULE": { background: "#f1f5f9", color: "#94a3b8" },
    "URGENT": { background: "#fee2e2", color: "#dc2626" },
  }

  const statutLabel = {
    "CONFIRME": "Confirmé", "EN_ATTENTE": "En attente",
    "ANNULE": "Annulé", "URGENT": "Urgent"
  }

  return (
    <div className="flex min-h-screen" style={{ background: "#f0f4ff" }}>
      <Sidebar active="Mes patients" />

      <main className="flex-1 p-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate("/mes-patients")}
            className="text-sm transition" style={{ color: "#6b7280" }}>
            ← Retour
          </button>
          {patient && (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: "#4f8ef7" }}>
                {patient.prenom[0]}{patient.nom[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: "#1e293b" }}>{patient.prenom} {patient.nom}</h2>
                <p className="text-xs" style={{ color: "#6b7280" }}>NSS : {patient.nss}</p>
              </div>
            </div>
          )}
        </div>

        {success && (
          <div className="text-sm px-4 py-3 mb-4" style={{ background: "#dcfce7", color: "#15803d", borderRadius: 12 }}>
            {success}
          </div>
        )}

        {/* Onglets */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "dossier", label: "Dossier médical" },
            { id: "notes", label: "Notes du médecin" },
            { id: "ordonnance", label: "Nouvelle ordonnance" },
          ].map(o => (
            <button key={o.id} onClick={() => setOnglet(o.id)}
              className="px-5 py-2 text-sm font-medium transition"
              style={{
                borderRadius: 10,
                background: onglet === o.id ? "#4f8ef7" : "#ffffff",
                color: onglet === o.id ? "#ffffff" : "#6b7280",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
              }}>
              {o.label}
            </button>
          ))}
        </div>

        {/* Onglet Dossier (lecture seule) */}
        {onglet === "dossier" && (
          <div className="flex flex-col gap-6">

            <div className="p-6" style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: "#1e293b" }}>Antécédents</h3>
              <p className="text-sm" style={{ color: dossier?.antecedents ? "#1e293b" : "#94a3b8" }}>
                {dossier?.antecedents || "Aucun antécédent renseigné par le patient"}
              </p>
            </div>

            <div className="p-6" style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: "#1e293b" }}>Antécédents chirurgicaux</h3>
              <p className="text-sm" style={{ color: dossier?.antecedentsChirurgicaux ? "#1e293b" : "#94a3b8" }}>
                {dossier?.antecedentsChirurgicaux || "Aucun antécédent chirurgical renseigné"}
              </p>
            </div>

            <div className="p-6" style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: "#1e293b" }}>Allergies</h3>
              <p className="text-sm" style={{ color: dossier?.allergies ? "#1e293b" : "#94a3b8" }}>
                {dossier?.allergies || "Aucune allergie renseignée"}
              </p>
            </div>

            <div className="p-6" style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: "#1e293b" }}>Rendez-vous</h3>
              {rdvs.length === 0 ? (
                <p className="text-sm" style={{ color: "#94a3b8" }}>Aucun rendez-vous</p>
              ) : (
                <div className="flex flex-col" style={{ gap: 0 }}>
                  {rdvs.map((r, i) => (
                    <div key={i} className="flex items-center gap-4 py-3"
                      style={{ borderBottom: i < rdvs.length - 1 ? "1px solid #e2e8f0" : "none" }}>
                      <div className="flex flex-col items-center px-3 py-2 w-16 flex-shrink-0"
                        style={{ background: "#e0ecff", borderRadius: 10 }}>
                        <span className="font-bold text-xs" style={{ color: "#4f8ef7" }}>
                          {new Date(r.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                        </span>
                        <span className="text-xs" style={{ color: "#4f8ef7" }}>{r.heure}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: "#1e293b" }}>{r.motif}</p>
                      </div>
                      <span className="text-xs px-3 py-1 font-medium"
                        style={{ borderRadius: 20, ...statutStyle[r.statut] }}>
                        {statutLabel[r.statut]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6" style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: "#1e293b" }}>Ordonnances</h3>
              {ordonnances.length === 0 ? (
                <p className="text-sm" style={{ color: "#94a3b8" }}>Aucune ordonnance</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {ordonnances.map((o, i) => (
                    <div key={i} className="px-4 py-3" style={{ background: "#f0f4ff", borderRadius: 12 }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs" style={{ color: "#6b7280" }}>
                          {new Date(o.date).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: "#1e293b" }}>{o.contenu}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Onglet Notes du médecin (seul champ modifiable) */}
        {onglet === "notes" && (
          <div className="p-6 max-w-2xl" style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <h3 className="text-base font-semibold mb-2" style={{ color: "#1e293b" }}>Notes / compte-rendu du médecin</h3>
            <p className="text-xs mb-6" style={{ color: "#6b7280" }}>
              Visible par le patient dans son dossier médical (lecture seule pour lui)
            </p>
            <textarea value={notesForm}
              onChange={e => setNotesForm(e.target.value)}
              placeholder="Compte-rendu de consultation, observations, recommandations..."
              rows={8}
              className="w-full px-4 py-3 text-sm outline-none resize-none"
              style={{ border: "1px solid #e2e8f0", borderRadius: 12, color: "#1e293b" }} />
            <button onClick={enregistrerNotes}
              className="w-full py-3 text-sm font-medium transition mt-4"
              style={{ background: "#4f8ef7", color: "#ffffff", borderRadius: 12 }}>
              Enregistrer les notes
            </button>
          </div>
        )}

        {/* Onglet Ordonnance */}
        {onglet === "ordonnance" && (
          <div className="p-6 max-w-2xl" style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <h3 className="text-base font-semibold mb-6" style={{ color: "#1e293b" }}>Rédiger une ordonnance</h3>
            <textarea value={ordonnanceForm.contenu}
              onChange={e => setOrdonnanceForm({ contenu: e.target.value })}
              placeholder="Médicament, posologie, durée du traitement, instructions..."
              rows={8}
              className="w-full px-4 py-3 text-sm outline-none resize-none"
              style={{ border: "1px solid #e2e8f0", borderRadius: 12, color: "#1e293b" }} />
            <button onClick={soumettreOrdonnance}
              className="w-full py-3 text-sm font-medium transition mt-4"
              style={{ background: "#4f8ef7", color: "#ffffff", borderRadius: 12 }}>
              Enregistrer l'ordonnance
            </button>
          </div>
        )}

      </main>
    </div>
  )
}