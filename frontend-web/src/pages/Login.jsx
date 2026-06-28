import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await api.post("/auth/login", { email, password })
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("userId", res.data.userId)
      localStorage.setItem("role", res.data.role)
      navigate("/")
    } catch (err) {
      setError("Email ou mot de passe incorrect")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center px-4">

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
        <h2 className="text-xl font-bold text-gray-800 mb-1">Connexion</h2>
        <p className="text-sm text-gray-400 mb-6">Connectez-vous à votre espace médecin</p>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
            Adresse email
          </label>
          <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 gap-3 focus-within:border-blue-400">
            <span className="text-gray-300">✉</span>
            <input
              type="email"
              placeholder="exemple@medica.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-300"
            />
          </div>
        </div>

        {/* Mot de passe */}
        <div className="mb-2">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
            Mot de passe
          </label>
          <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 gap-3 focus-within:border-blue-400">
            <span className="text-gray-300">🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-300"
            />
            <button onClick={() => setShowPassword(!showPassword)} className="text-gray-300 hover:text-gray-500">
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        <div className="flex justify-end mb-6">
          <button className="text-sm text-blue-500 hover:text-blue-600">
            Mot de passe oublié ?
          </button>
        </div>

        {/* Bouton */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition text-sm tracking-wider">
          {loading ? "Connexion..." : "SE CONNECTER"}
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Pas encore de compte ?{" "}
          <span onClick={() => navigate("/register")}
            className="text-blue-500 font-medium cursor-pointer hover:text-blue-600">
            S'inscrire
          </span>
        </p>
      </div>

      <p className="text-xs text-gray-400 mt-6">Connexion sécurisée — données chiffrées</p>
    </div>
  )
}