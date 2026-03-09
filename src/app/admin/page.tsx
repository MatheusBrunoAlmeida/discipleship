import { prisma } from '@/lib/prisma'
import { getCurrentOrLastFriday, formatDate } from '@/lib/utils'
import Link from 'next/link'

async function getStats() {
  const [gerentes, discipuladores, discipulos, totalPresencas] = await Promise.all([
    prisma.gerente.count(),
    prisma.discipulador.count(),
    prisma.discipulo.count(),
    prisma.frequencia.count({ where: { presente: true, data: getCurrentOrLastFriday() } }),
  ])
  return { gerentes, discipuladores, discipulos, totalPresencas }
}

export default async function AdminDashboard() {
  const stats = await getStats()
  const lastFriday = getCurrentOrLastFriday()

  const cards = [
    { label: 'Gerentes', value: stats.gerentes, icon: '👥', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Discipuladores', value: stats.discipuladores, icon: '🧑‍🏫', color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Discípulos', value: stats.discipulos, icon: '📖', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Presenças (última sexta)', value: stats.totalPresencas, icon: '✅', color: 'text-green-600', bg: 'bg-green-50' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Visão geral do sistema</p>
      </div>

      {/* Date chip */}
      <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-medium px-3 py-1.5 rounded-full mb-6">
        📅 Última sexta-feira: {formatDate(lastFriday)}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c) => (
          <div key={c.label} className="stat-card">
            <div className={`stat-icon ${c.bg}`}>
              <span className="text-lg">{c.icon}</span>
            </div>
            <div className={`stat-value ${c.color}`}>{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Ações Rápidas</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/gerentes" className="btn-primary">+ Novo Gerente</Link>
          <Link href="/admin/discipuladores" className="btn-primary">+ Novo Discipulador</Link>
          <Link href="/admin/discipulos/novo" className="btn-primary">+ Novo Discípulo</Link>
          <Link href="/admin/relatorios" className="btn-secondary">Ver Relatórios →</Link>
        </div>
      </div>
    </div>
  )
}
