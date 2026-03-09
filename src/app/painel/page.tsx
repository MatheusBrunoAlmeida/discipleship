import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentOrLastFriday, formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function PainelHome() {
  const session = await auth()
  if (!session?.user?.discipuladorId) redirect('/login')

  const discipuladorId = session.user.discipuladorId!

  const [discipulador, discipulos] = await Promise.all([
    prisma.discipulador.findUnique({ where: { id: discipuladorId }, include: { gerente: true } }),
    prisma.discipulo.findMany({ where: { discipuladorId }, orderBy: { nome: 'asc' } }),
  ])

  const lastFriday = getCurrentOrLastFriday()
  const frequencias = await prisma.frequencia.findMany({
    where: { discipuladorId, data: lastFriday },
  })

  const presencaMap = new Map(frequencias.map((f) => [f.discipuloId, f.presente]))
  const totalPresentes = [...presencaMap.values()].filter(Boolean).length
  const chamadaFeita = frequencias.length > 0

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          Olá, {discipulador?.nome?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {discipulador?.nomeDiscipulado} · {discipulador?.gerente?.nome}
        </p>
      </div>

      {/* Friday banner */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">Última Sexta-feira</p>
          <p className="text-sm font-semibold text-indigo-700 mt-0.5">{formatDate(lastFriday)}</p>
        </div>
        {chamadaFeita ? (
          <span className="badge badge-green">✓ Chamada feita</span>
        ) : (
          <Link href="/painel/chamada" className="btn-primary text-xs px-3 py-1.5">
            Fazer chamada →
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Discípulos', value: discipulos.length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Presentes', value: chamadaFeita ? totalPresentes : '—', color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Ausentes', value: chamadaFeita ? discipulos.length - totalPresentes : '—', color: 'text-red-500', bg: 'bg-red-50' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Disciples list */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-900">Meus Discípulos</h2>
        <Link href="/painel/discipulos/novo" className="btn-primary text-xs px-3 py-1.5">+ Novo</Link>
      </div>

      {discipulos.length === 0 ? (
        <div className="card text-center py-10">
          <div className="text-4xl mb-3">🤝</div>
          <p className="text-gray-500 text-sm">Nenhum discípulo cadastrado</p>
          <Link href="/painel/discipulos/novo" className="btn-primary mt-4 inline-flex">
            Cadastrar primeiro discípulo
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {discipulos.map((d) => {
            const presente = presencaMap.get(d.id)
            return (
              <div key={d.id} className="card-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {d.nome.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-gray-900 truncate">{d.nome}</div>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {d.goe && <span className="badge badge-yellow">GOE</span>}
                      {d.visitante && <span className="badge badge-purple">Visitante</span>}
                      <span className="text-xs text-gray-400">{d.estrutura}</span>
                    </div>
                  </div>
                </div>
                {chamadaFeita && (
                  <span className={`badge flex-shrink-0 ${presente ? 'badge-green' : 'badge-red'}`}>
                    {presente ? '✓' : '✗'}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
