const colorMap = {
  blue: 'text-med-blue bg-med-blue/10',
  gold: 'text-med-gold bg-med-gold/10',
  green: 'text-green-400 bg-green-400/10',
  red: 'text-red-400 bg-red-400/10',
}

export default function StatCard({ icon, label, value, trend, trendUp, color = 'blue' }) {
  return (
    <div className="bg-med-card border border-med-border rounded-xl p-4">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base mb-3 ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-med-text/50 mt-1 tracking-wide">{label}</div>
      <div className={`text-xs mt-1 ${trendUp ? 'text-green-400' : 'text-med-text/40'}`}>
        {trendUp ? '↑ ' : ''}{trend}
      </div>
    </div>
  )
}