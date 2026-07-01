import { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import api from "../services/api"

export default function Profil() {
  const [medecin, setMedecin] = useState(null)
  const [form, setForm] = useState({ telephone: "", specialite: "", ville: "" })
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/medecins/profil").then(res => {
      setMedecin(res.data)
      setForm({
        telephone: res.data.telephone || "",
        specialite: res.data.specialite || "",
        ville: res.data.ville || ""
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const enregistrer = async () => {
    try {
      const res = await api.put("/medecins/profil", form)
      setMedecin({ ...medecin, ...res.data })
      setSuccess("Profil mis à jour avec succès !")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return (
    <div className="flex min-h-screen" style={{ background: "#f0f4ff" }}>
      <Sidebar active="Mon profil" />
      <main className="flex-1 p-8 flex items-center justify-center">
        <p style={{ color: "#6b7280" }}>Chargement...</p>
      </main>
    </div>
  )

  return (
    <div className="flex min-h-screen" style={{ background: "#f0f4ff" }}>
      <Sidebar active="Mon profil" />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold" style={{ color: "#1e293b" }}>Mon profil</h2>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
            Visible publiquement par vos patients
          </p>
        </div>

        {success && (
          <div className="text-sm px-4 py-3 mb-6"
            style={{ background: "#dcfce7", color: "#15803d", borderRadius: 12 }}>
            {success}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">

          {/* Infos profil */}
          <div className="p-6" style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

            {/* Avatar + nom */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                style={{ background: "#4f8ef7" }}>
                {medecin?.prenom?.[0]}{medecin?.nom?.[0]}
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: "#1e293b" }}>
                  Dr. {medecin?.prenom} {medecin?.nom}
                </h3>
                <p className="text-sm" style={{ color: "#6b7280" }}>{medecin?.user?.email}</p>
              </div>
            </div>

            {/* Champs lecture seule */}
            <div className="flex flex-col gap-4 mb-6">
              {[
                { label: "Nom", value: medecin?.nom },
                { label: "Prénom", value: medecin?.prenom },
                { label: "Email", value: medecin?.user?.email },
              ].map((item, i) => (
                <div key={i}>
                  <label className="text-xs font-medium uppercase tracking-wider mb-1 block"
                    style={{ color: "#6b7280" }}>
                    {item.label}
                  </label>
                  <div className="px-4 py-3 text-sm"
                    style={{ background: "#f0f4ff", borderRadius: 12, color: "#1e293b" }}>
                    {item.value || "—"}
                  </div>
                </div>
              ))}
            </div>

            {/* Champs modifiables */}
            <div className="flex flex-col gap-4">
              {[
                { key: "specialite", label: "Spécialité", placeholder: "Ex: Médecine générale" },
                { key: "ville", label: "Ville", placeholder: "Ex: Paris" },
                { key: "telephone", label: "Téléphone", placeholder: "Ex: 06 12 34 56 78" },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-xs font-medium uppercase tracking-wider mb-1 block"
                    style={{ color: "#6b7280" }}>
                    {field.label}
                  </label>
                  <input value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 text-sm outline-none"
                    style={{ border: "1px solid #e2e8f0", borderRadius: 12, color: "#1e293b" }} />
                </div>
              ))}

              <button onClick={enregistrer}
                className="w-full py-3 text-sm font-medium transition mt-2"
                style={{ background: "#4f8ef7", color: "#ffffff", borderRadius: 12 }}>
                Enregistrer les modifications
              </button>
            </div>
          </div>

          {/* Carte infos publiques */}
          <div className="p-6" style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <h3 className="text-sm font-semibold mb-6" style={{ color: "#1e293b" }}>
              Aperçu profil public
            </h3>

            <div className="p-5 mb-6" style={{ background: "#f0f4ff", borderRadius: 12 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: "#4f8ef7" }}>
                  {medecin?.prenom?.[0]}{medecin?.nom?.[0]}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#1e293b" }}>
                    Dr. {medecin?.prenom} {medecin?.nom}
                  </p>
                  <p className="text-xs" style={{ color: "#4f8ef7" }}>
                    {form.specialite || medecin?.specialite}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  {
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    ),
                    value: form.ville || medecin?.ville
                  },
                  {
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2.69h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    ),
                    value: form.telephone || "Non renseigné"
                  },
                  {
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    ),
                    value: medecin?.user?.email
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="text-sm" style={{ color: "#1e293b" }}>
                      {item.value || "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4" style={{ background: "#f0f4ff", borderRadius: 12 }}>
              <p className="text-xs font-medium mb-2" style={{ color: "#6b7280" }}>
                INFORMATIONS VISIBLES PAR LES PATIENTS
              </p>
              <p className="text-xs" style={{ color: "#94a3b8" }}>
                Nom, spécialité, ville et téléphone sont affichés sur votre profil public.
                L'email n'est pas visible par les patients.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}