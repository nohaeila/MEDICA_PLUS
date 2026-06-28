import { useNavigate } from "react-router-dom"

export default function Sidebar({ active }) {
  const navigate = useNavigate()

  const nav = [
    { label: "Dashboard", path: "/" },
    { label: "Gestion des RDV", path: "/gestion-rdv" },
    { label: "Agenda", path: "/agenda" },
    { label: "Médecins", path: "/medecins" },
    { label: "Notifications", path: "/notifications" },
  ]

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    localStorage.removeItem("role")
    navigate("/login")
  }

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col p-6 shadow-sm">
      <h1 className="text-xl font-bold text-blue-500 mb-10">MEDICA+</h1>

      <nav className="flex flex-col gap-1 flex-1">
        {nav.map((item) => (
          <button key={item.label}
            onClick={() => navigate(item.path)}
            className={`text-left px-4 py-2.5 rounded-lg text-sm transition
              ${active === item.label
                ? "bg-blue-500 text-white font-medium"
                : "text-gray-500 hover:bg-slate-100 hover:text-gray-800"}`}>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-gray-100 pt-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold text-white">
          IM
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">Dr. Ingrid M.</p>
          <p className="text-xs text-gray-400">Médecin Généraliste</p>
        </div>
      </div>

      <button onClick={handleLogout}
        className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-50 transition mt-3">
        Déconnexion
      </button>
    </aside>
  )
}