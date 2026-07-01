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
      navigate("/dashboard")
    } catch (err) {
      setError("Email ou mot de passe incorrect")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "#f0f4ff" }}>

      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
          style={{ background: "#4f8ef7", boxShadow: "0 4px 20px rgba(79,142,247,0.3)" }}>
          <span className="text-white text-3xl font-bold">+</span>
        </div>
        <h1 className="text-2xl font-bold tracking-wide" style={{ color: "#1e293b" }}>
          MEDICA<span style={{ color: "#4f8ef7" }}>+</span>
        </h1>
        <p className="text-xs tracking-widest mt-1" style={{ color: "#6b7280" }}>HEALTH PLATFORM</p>
      </div>

      {/* Card */}
      <div className="p-8 w-full max-w-md"
        style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

        <h2 className="text-xl font-bold mb-1" style={{ color: "#1e293b" }}>Connexion</h2>
        <p className="text-sm mb-6" style={{ color: "#6b7280" }}>Connectez-vous à votre espace médecin</p>

        {error && (
          <div className="text-sm px-4 py-3 mb-4"
            style={{ background: "#fee2e2", color: "#dc2626", borderRadius: 10 }}>
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="text-xs font-medium uppercase tracking-wider mb-2 block"
            style={{ color: "#6b7280" }}>
            Adresse email
          </label>
          <div className="flex items-center gap-3 px-4 py-3"
            style={{ border: "1px solid #e2e8f0", borderRadius: 12 }}>
            <span style={{ color: "#94a3b8" }}>✉</span>
            <input type="email" placeholder="exemple@medica.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="flex-1 text-sm outline-none"
              style={{ color: "#1e293b", background: "transparent" }} />
          </div>
        </div>

        {/* Mot de passe */}
        <div className="mb-2">
          <label className="text-xs font-medium uppercase tracking-wider mb-2 block"
            style={{ color: "#6b7280" }}>
            Mot de passe
          </label>
          <div className="flex items-center gap-3 px-4 py-3"
            style={{ border: "1px solid #e2e8f0", borderRadius: 12 }}>
            <span style={{ color: "#94a3b8" }}>🔒</span>
            <input type={showPassword ? "text" : "password"} placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="flex-1 text-sm outline-none"
              style={{ color: "#1e293b", background: "transparent" }} />
            <button onClick={() => setShowPassword(!showPassword)}
              style={{ color: "#94a3b8" }}>
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        <div className="flex justify-end mb-6">
          <button className="text-sm" style={{ color: "#4f8ef7" }}>
            Mot de passe oublié ?
          </button>
        </div>

        <button onClick={handleLogin} disabled={loading}
          className="w-full font-semibold py-3 text-sm tracking-wider transition text-white"
          style={{ background: "#4f8ef7", borderRadius: 12 }}>
          {loading ? "Connexion..." : "SE CONNECTER"}
        </button>

        <p className="text-center text-sm mt-4" style={{ color: "#6b7280" }}>
          Pas encore de compte ?{" "}
          <span onClick={() => navigate("/register")}
            className="font-medium cursor-pointer"
            style={{ color: "#4f8ef7" }}>
            S'inscrire
          </span>
        </p>
      </div>

      <p className="text-xs mt-6" style={{ color: "#6b7280" }}>
        Connexion sécurisée — données chiffrées
      </p>
    </div>
  )
}