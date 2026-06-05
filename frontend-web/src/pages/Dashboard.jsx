import Sidebar from '../components/Layout/Sidebar'
import Topbar from '../components/Layout/Topbar'
import StatCard from '../components/dashboard/StatCard'
import RdvList from '../components/dashboard/RdvList'

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-med-bg overflow-hidden">
      <Sidebar activePage="dashboard" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar title="Dashboard médecin" />

        <main className="flex-1 overflow-y-auto p-6">

          {/* Ligne de stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard icon="👥" label="PATIENTS ACTIFS" value="142" trend="+8 ce mois" trendUp />
            <StatCard icon="📅" label="RDV AUJOURD'HUI" value="9" trend="3 en attente" color="gold" />
            <StatCard icon="📄" label="ORDONNANCES" value="24" trend="+12%" trendUp color="green" />
            <StatCard icon="🚨" label="URGENCES" value="2" trend="Action requise" color="red" />
          </div>

          {/* Contenu principal */}
          <div className="grid grid-cols-2 gap-6">
            <RdvList />

            {/* Carte activité */}
            <div className="bg-med-card border border-med-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-med-border flex justify-between items-center">
                <span className="text-sm font-semibold text-med-text">Activité hebdomadaire</span>
              </div>
              <div className="p-4 text-med-text/50 text-sm text-center py-12">
                📊 Graphique à intégrer (recharts)
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}