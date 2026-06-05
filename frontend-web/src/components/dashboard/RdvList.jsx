const rdvs = [
  { time: '08:30', initials: 'MA', name: 'Martin Alain', type: 'Consultation générale', status: 'confirmed' },
  { time: '09:15', initials: 'SB', name: 'Sophie Bernard', type: 'Suivi cardiologique', status: 'pending' },
  { time: '10:00', initials: 'LK', name: 'Lucas Klein', type: 'Urgence signalée', status: 'urgent' },
  { time: '11:30', initials: 'PC', name: 'Pauline Caron', type: 'Renouvellement ordonnance', status: 'confirmed' },
  { time: '14:00', initials: 'NR', name: 'Nadia Rousseau', type: 'Bilan annuel', status: 'confirmed' },
]

const statusStyle = {
  confirmed: 'bg-green-400/10 text-green-400 border border-green-400/20',
  pending: 'bg-med-gold/10 text-med-gold border border-med-gold/20',
  urgent: 'bg-red-400/10 text-red-400 border border-red-400/20',
}
const statusLabel = { confirmed: 'Confirmé', pending: 'En attente', urgent: 'Urgent' }

export default function RdvList() {
  return (
    <div className="bg-med-card border border-med-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-med-border flex justify-between items-center">
        <span className="text-sm font-semibold text-med-text flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-med-blue rounded-full inline-block"></span>
          RDV du jour
        </span>
        <span className="text-xs text-med-blue cursor-pointer">Voir agenda →</span>
      </div>
      <div className="divide-y divide-med-border/50">
        {rdvs.map((rdv) => (
          <div key={rdv.time} className="flex items-center gap-3 px-4 py-2.5">
            <span className="text-xs text-med-gold font-semibold w-12">{rdv.time}</span>
            <div className="w-8 h-8 rounded-full bg-med-btn flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {rdv.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-med-text">{rdv.name}</div>
              <div className="text-xs text-med-text/40">{rdv.type}</div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded font-semibold ${statusStyle[rdv.status]}`}>
              {statusLabel[rdv.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}