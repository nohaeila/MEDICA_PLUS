import { useNavigate } from "react-router-dom"

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-5 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center shadow">
            <span className="text-white text-lg font-bold">+</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">MEDICA<span className="text-blue-500">+</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/login")}
            className="px-5 py-2 text-sm font-medium text-blue-500 border border-blue-500 rounded-xl hover:bg-blue-50 transition">
            Se connecter
          </button>
          <button onClick={() => navigate("/register")}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition">
            S'inscrire
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center mb-6 shadow-lg">
          <span className="text-white text-4xl font-bold">+</span>
        </div>

        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          La plateforme médicale <span className="text-blue-500">nouvelle génération</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-xl mb-10">
          Gérez vos patients, rédigez vos ordonnances et suivez vos rendez-vous en toute simplicité.
        </p>

        <div className="flex gap-4">
          <button onClick={() => navigate("/register")}
            className="px-8 py-3 text-sm font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition shadow-md">
            Commencer gratuitement
          </button>
          <button onClick={() => navigate("/login")}
            className="px-8 py-3 text-sm font-semibold text-blue-500 border border-blue-500 rounded-xl hover:bg-blue-50 transition">
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
          <div key={i} className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-500 font-bold text-lg">+</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">{f.titre}</h3>
            <p className="text-xs text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center pb-6">
        <p className="text-xs text-gray-400">Connexion sécurisée — données chiffrées — RGPD</p>
      </div>
    </div>
  )
}