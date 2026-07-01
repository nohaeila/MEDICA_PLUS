import { useNavigate } from "react-router-dom"

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f0f4ff" }}>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-5"
        style={{ background: "#ffffff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center shadow"
            style={{ background: "#4f8ef7" }}>
            <span className="text-white text-lg font-bold">+</span>
          </div>
          <h1 className="text-xl font-bold" style={{ color: "#1e293b" }}>
            MEDICA<span style={{ color: "#4f8ef7" }}>+</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/login")}
            className="px-5 py-2 text-sm font-medium transition"
            style={{ color: "#4f8ef7", border: "1px solid #4f8ef7", borderRadius: 10 }}>
            Se connecter
          </button>
          <button onClick={() => navigate("/register")}
            className="px-5 py-2 text-sm font-medium text-white transition"
            style={{ background: "#4f8ef7", borderRadius: 10 }}>
            S'inscrire
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: "#4f8ef7", boxShadow: "0 4px 20px rgba(79,142,247,0.3)" }}>
          <span className="text-white text-4xl font-bold">+</span>
        </div>

        <h2 className="text-4xl font-bold mb-4" style={{ color: "#1e293b" }}>
          La plateforme médicale{" "}
          <span style={{ color: "#4f8ef7" }}>nouvelle génération</span>
        </h2>

        <p className="text-lg max-w-xl mb-10" style={{ color: "#6b7280" }}>
          Gérez vos patients, rédigez vos ordonnances et suivez vos rendez-vous en toute simplicité.
        </p>

        <div className="flex gap-4">
          <button onClick={() => navigate("/register")}
            className="px-8 py-3 text-sm font-semibold text-white transition"
            style={{ background: "#4f8ef7", borderRadius: 12, boxShadow: "0 4px 12px rgba(79,142,247,0.3)" }}>
            Commencer gratuitement
          </button>
          <button onClick={() => navigate("/login")}
            className="px-8 py-3 text-sm font-semibold transition"
            style={{ color: "#4f8ef7", border: "1px solid #4f8ef7", borderRadius: 12, background: "#ffffff" }}>
            J'ai déjà un compte
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-6 px-16 pb-16">
        {[
          { titre: "Gestion des patients", desc: "Accédez aux dossiers médicaux de vos patients en un clic" },
          { titre: "Ordonnances numériques", desc: "Rédigez et envoyez vos ordonnances directement depuis la plateforme" },
          { titre: "Agenda intelligent", desc: "Gérez vos rendez-vous et recevez des notifications en temps réel" },
        ].map((f, i) => (
          <div key={i} className="p-6 text-center"
            style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ background: "#e0ecff" }}>
              <span className="font-bold text-lg" style={{ color: "#4f8ef7" }}>+</span>
            </div>
            <h3 className="text-sm font-semibold mb-2" style={{ color: "#1e293b" }}>{f.titre}</h3>
            <p className="text-xs" style={{ color: "#6b7280" }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center pb-6">
        <p className="text-xs" style={{ color: "#6b7280" }}>
          Connexion sécurisée — données chiffrées — RGPD
        </p>
      </div>
    </div>
  )
}