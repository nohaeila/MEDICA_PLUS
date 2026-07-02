import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
 
export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: "", password: "", nom: "", prenom: "",
    specialite: "", rpps: "", telephone: "", adresse: ""
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
 
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
 
  const handleRegister = async () => {
    setLoading(true)
    setError("")
    try {
      await api.post("/auth/register", { ...form, role: "medecin" })
      navigate("/login")
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription.")
    } finally {
      setLoading(false)
    }
  }
 
  const inputStyle = {
    width: "100%",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "12px 16px",
    fontSize: 14,
    outline: "none",
    color: "#1e293b",
    background: "#ffffff"
  }
 
  const labelStyle = {
    fontSize: 11,
    fontWeight: 500,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    display: "block",
    marginBottom: 6
  }
 
  return (
<div className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: "#f0f4ff" }}>
 
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
 
      <div className="p-8 w-full max-w-md"
        style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
 
        <h2 className="text-xl font-bold mb-1" style={{ color: "#1e293b" }}>Créer un compte</h2>
<p className="text-sm mb-6" style={{ color: "#6b7280" }}>Inscrivez-vous en tant que médecin</p>
 
        {error && (
<div className="text-sm px-4 py-3 mb-4"
            style={{ background: "#fee2e2", color: "#dc2626", borderRadius: 10 }}>
            {error}
</div>
        )}
 
        <div className="flex flex-col gap-4">
<div className="grid grid-cols-2 gap-3">
<div>
<label style={labelStyle}>Prénom</label>
<input name="prenom" placeholder="Jean"
                onChange={handleChange} style={inputStyle} />
</div>
<div>
<label style={labelStyle}>Nom</label>
<input name="nom" placeholder="Dupont"
                onChange={handleChange} style={inputStyle} />
</div>
</div>
 
          <div>
<label style={labelStyle}>Adresse email</label>
<input name="email" type="email" placeholder="exemple@medica.fr"
              onChange={handleChange} style={inputStyle} />
</div>
 
          <div>
<label style={labelStyle}>Mot de passe</label>
<input name="password" type="password" placeholder="••••••••"
              onChange={handleChange} style={inputStyle} />
</div>
 
          <div>
<label style={labelStyle}>Spécialité</label>
<input name="specialite" placeholder="Médecin généraliste"
              onChange={handleChange} style={inputStyle} />
</div>
 
          <div>
<label style={labelStyle}>Numéro RPPS</label>
<input name="rpps" placeholder="11 chiffres"
              onChange={handleChange} style={inputStyle} />
</div>
 
          <div>
<label style={labelStyle}>Téléphone</label>
<input name="telephone" placeholder="06 12 34 56 78"
              onChange={handleChange} style={inputStyle} />
</div>
 
          <div>
<label style={labelStyle}>Adresse du cabinet</label>
<input name="adresse" placeholder="12 rue de la Paix, 75002 Paris"
              onChange={handleChange} style={inputStyle} />
</div>
</div>
 
        <button onClick={handleRegister} disabled={loading}
          className="w-full font-semibold py-3 text-sm tracking-wider transition text-white mt-6"
          style={{ background: "#4f8ef7", borderRadius: 12 }}>
          {loading ? "Inscription..." : "S'INSCRIRE"}
</button>
 
        <p className="text-center text-sm mt-4" style={{ color: "#6b7280" }}>
          Déjà un compte ?{" "}
<span onClick={() => navigate("/login")}
            className="font-medium cursor-pointer"
            style={{ color: "#4f8ef7" }}>
            Se connecter
</span>
</p>
</div>
 
      <p className="text-xs mt-6" style={{ color: "#6b7280" }}>
        Connexion sécurisée — données chiffrées
</p>
</div>
  )
}