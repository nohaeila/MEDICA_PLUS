const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'rdv', label: 'Prise de RDV', icon: '📅', badge: 3 },
  { id: 'agenda', label: 'Agenda', icon: '🗓' },
  { id: 'medecins', label: 'Médecins', icon: '🩺' },
  { id: 'notifs', label: 'Notifications', icon: '🔔', badge: 5, badgeGold: true },
]

export default function Sidebar({ activePage }) {
  return (
    <aside className="w-56 bg-med-card border-r border-med-border flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-med-border">
        <div className="text-xs tracking-widest text-med-blue bg-med-blue/10 border border-med-blue/30 rounded px-2 py-1 inline-block mb-2">
          PLATEFORME MÉDICALE
        </div>
        <div className="text-2xl font-bold text-white tracking-wide">
          MEDICA<span className="text-med-gold">+</span>
        </div>
        <div className="text-xs tracking-widest text-med-text/40 mt-1">
          PREMIUM HEALTH PLATFORM
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navItems.map(item => (
          <div
            key={item.id}
            className={`flex items-center gap-3 px-5 py-2.5 text-sm cursor-pointer border-l-[3px] transition-all
              ${activePage === item.id
                ? 'text-med-blue border-med-blue bg-med-blue/8'
                : 'text-med-text/50 border-transparent hover:text-med-text hover:bg-med-blue/5'
              }`}
          >
            <span>{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                ${item.badgeGold ? 'bg-med-gold text-black' : 'bg-med-blue text-white'}`}>
                {item.badge}
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* Profil médecin */}
      <div className="m-3 p-3 bg-[#0f1c2e] border border-med-border rounded-xl">
        <div className="w-9 h-9 rounded-full bg-med-btn flex items-center justify-center text-xs font-bold text-white mb-2">
          IM
        </div>
        <div className="text-xs font-semibold text-med-text">Dr. Ingrid M.</div>
        <div className="text-xs text-med-text/40">Médecin Généraliste</div>
      </div>
    </aside>
  )
}