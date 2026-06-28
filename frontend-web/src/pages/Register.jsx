import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: "", password: "", nom: "", prenom: "",
    specialite: "", ville: ""
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleRegister = async () => {
    setLoading(true)
    setError("")
    try {
      await api.post("/auth/register", { ...form, role: "MEDECIN" })
      navigate("/login")
    } catch (err) {
      setError("Erreur lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center px-4 py-10">

      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mb-3 shadow-md">
          <span className="text-white text-3xl font-bold">+</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 tracking-wide">MEDICA<span className="text-blue-500">+</span></h1>
        <p className="text-xs text-gray-400 tracking-widest mt-1">HEALTH PLATFORM</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Créer un compte</h2>
        <p className="text-sm text-gray-400 mb-6">Inscrivez-vous en tant que médecin</p>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
        )}

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">Prénom</label>
              <input name="prenom" placeholder="Jean" onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">Nom</label>
              <input name="nom" placeholder="Dupont" onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">Adresse email</label>
            <input name="email" type="email" placeholder="exemple@medica.fr" onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400" />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">Mot de passe</label>
            <input name="password" type="password" placeholder="••••••••" onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400" />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">Spécialité</label>
            <input name="specialite" placeholder="Médecin généraliste" onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400" />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">Ville</label>
            <input name="ville" placeholder="Paris 8e" onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400" />
          </div>
        </div>

        <button onClick={handleRegister} disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition text-sm tracking-wider mt-6">
          {loading ? "Inscription..." : "S'INSCRIRE"}
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Déjà un compte ?{" "}
          <span onClick={() => navigate("/login")}
            className="text-blue-500 font-medium cursor-pointer hover:text-blue-600">
            Se connecter
          </span>
        </p>
      </div>

      <p className="text-xs text-gray-400 mt-6">Connexion sécurisée — données chiffrées</p>
    </div>
  )
}