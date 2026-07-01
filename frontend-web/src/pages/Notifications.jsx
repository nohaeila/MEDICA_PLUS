import { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import api from "../services/api"

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const typeStyle = {
    rdv: { background: "#dcfce7", color: "#15803d" },
    annulation: { background: "#ffedd5", color: "#c2410c" },
    urgent: { background: "#fee2e2", color: "#dc2626" },
    rappel: { background: "#e0ecff", color: "#4f8ef7" },
  }

  const typeIcon = {
    rdv: "✓", annulation: "✕", urgent: "!", rappel: "◷",
  }

  const getType = (message) => {
    if (!message) return "rappel"
    const m = message.toLowerCase()
    if (m.includes("annul")) return "annulation"
    if (m.includes("urgent") || m.includes("urgence")) return "urgent"
    if (m.includes("rdv") || m.includes("rendez-vous")) return "rdv"
    return "rappel"
  }

  const getTemps = (createdAt) => {
    const diff = Math.floor((new Date() - new Date(createdAt)) / 1000)
    if (diff < 60) return "À l'instant"
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`
    return `Il y a ${Math.floor(diff / 86400)} jour(s)`
  }

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) return
    api.get(`/notifications/${userId}`)
      .then(res => { setNotifications(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const marquerLu = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications(notifications.map(n => n.id === id ? { ...n, lu: true } : n))
    } catch (err) {
      console.error(err)
    }
  }

  const toutMarquerLu = async () => {
    try {
      await Promise.all(
        notifications.filter(n => !n.lu).map(n => api.put(`/notifications/${n.id}/read`))
      )
      setNotifications(notifications.map(n => ({ ...n, lu: true })))
    } catch (err) {
      console.error(err)
    }
  }

  const nonLues = notifications.filter(n => !n.lu).length

  return (
    <div className="flex min-h-screen" style={{ background: "#f0f4ff" }}>
      <Sidebar active="Notifications" />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "#1e293b" }}>Notifications</h2>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
              {nonLues > 0 ? `${nonLues} non lue${nonLues > 1 ? "s" : ""}` : "Tout est à jour"}
            </p>
          </div>
          {nonLues > 0 && (
            <button onClick={toutMarquerLu} className="text-sm font-medium transition"
              style={{ color: "#4f8ef7" }}>
              Tout marquer comme lu
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-10" style={{ color: "#6b7280" }}>Chargement...</div>
        ) : notifications.length === 0 ? (
          <div className="p-10 text-center" style={{ background: "#ffffff", borderRadius: 14, color: "#6b7280" }}>
            Aucune notification pour le moment
          </div>
        ) : (
          <div style={{ background: "#ffffff", borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            {notifications.map((n, i) => (
              <div key={n.id} onClick={() => marquerLu(n.id)}
                className="flex items-start gap-4 px-6 py-4 cursor-pointer transition"
                style={{
                  borderBottom: i < notifications.length - 1 ? "1px solid #e2e8f0" : "none",
                  background: !n.lu ? "#f0f4ff" : "transparent",
                }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5"
                  style={typeStyle[getType(n.message)]}>
                  {typeIcon[getType(n.message)]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: !n.lu ? "#1e293b" : "#6b7280" }}>
                    {n.titre || "Notification"}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{n.message}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-xs" style={{ color: "#6b7280" }}>
                    {getTemps(n.createdAt)}
                  </span>
                  {!n.lu && (
                    <span className="w-2 h-2 rounded-full" style={{ background: "#4f8ef7" }}></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}