export default function Topbar({ title }) {
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <header className="bg-med-card border-b border-med-border px-6 py-3 flex items-center justify-between flex-shrink-0">
      <span className="text-sm font-semibold text-med-text tracking-wide">
        {title}
      </span>

      <div className="flex items-center gap-3">
        <span className="text-xs text-med-text/50 bg-[#0f1c2e] border border-med-border rounded-md px-3 py-1.5 capitalize">
          📅 {today}
        </span>
        <div className="relative w-9 h-9 bg-[#0f1c2e] border border-med-border rounded-lg flex items-center justify-center cursor-pointer hover:border-med-blue transition-colors">
          🔔
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-med-gold rounded-full border-2 border-med-card"></span>
        </div>
      </div>
    </header>
  )
}