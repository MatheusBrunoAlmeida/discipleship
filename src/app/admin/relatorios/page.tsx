'use client'

import { useState, useEffect } from 'react'
import { getRelatorio } from '@/actions/frequencias'
import { getGerentes } from '@/actions/gerentes'
import { getDiscipuladores } from '@/actions/discipuladores'
import { toISODate } from '@/lib/utils'

type Gerente = { id: number; nome: string }
type Discipulador = { id: number; nome: string; gerenteId: number; gerente: any }
type Row = { id: number; presente: boolean; data: Date; discipuloIdent: { nome: string }; discipulador: { nome: string; gerente: { nome: string } } }

export default function RelatoriosPage() {
  const [gerentes, setGerentes] = useState<Gerente[]>([])
  const [discipuladores, setDiscipuladores] = useState<Discipulador[]>([])
  const [rows, setRows] = useState<Row[]>([])
  const [filter, setFilter] = useState({ gerenteId: '', discipuladorId: '', data: '' })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Promise.all([getGerentes(), getDiscipuladores()]).then(([g, d]) => {
      setGerentes(g as any)
      setDiscipuladores(d as any)
    })
  }, [])

  const filteredDiscip = filter.gerenteId
    ? discipuladores.filter((d) => d.gerenteId === Number(filter.gerenteId))
    : discipuladores

  const handleSearch = async () => {
    const opts: any = {}
    if (filter.discipuladorId) opts.discipuladorId = Number(filter.discipuladorId)
    if (filter.data) opts.data = new Date(filter.data + 'T00:00:00.000Z')
    const data = await getRelatorio(opts)
    setRows(data as any)
    setLoaded(true)
  }

  const presentes = rows.filter((r) => r.presente).length
  const ausentes = rows.filter((r) => !r.presente).length

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Relatórios de Presença</h1>
        <p className="page-subtitle">Filtre e visualize as frequências</p>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label className="label">Gerente</label>
            <select className="input" value={filter.gerenteId} onChange={(e) => setFilter({ ...filter, gerenteId: e.target.value, discipuladorId: '' })}>
              <option value="">Todos</option>
              {gerentes.map((g) => <option key={g.id} value={g.id}>{g.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Discipulador</label>
            <select className="input" value={filter.discipuladorId} onChange={(e) => setFilter({ ...filter, discipuladorId: e.target.value })}>
              <option value="">Todos</option>
              {filteredDiscip.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Data</label>
            <input className="input" type="date" value={filter.data} onChange={(e) => setFilter({ ...filter, data: e.target.value })} />
          </div>
        </div>
        <button className="btn-primary" onClick={handleSearch}>🔍 Buscar</button>
      </div>

      {/* Summary */}
      {loaded && (
        <>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <div className="stat-card" style={{ flex: 1, minWidth: 120 }}>
              <div className="stat-label">Total</div>
              <div className="stat-value">{rows.length}</div>
            </div>
            <div className="stat-card" style={{ flex: 1, minWidth: 120 }}>
              <div className="stat-label">Presentes</div>
              <div className="stat-value" style={{ color: '#10b981' }}>{presentes}</div>
            </div>
            <div className="stat-card" style={{ flex: 1, minWidth: 120 }}>
              <div className="stat-label">Ausentes</div>
              <div className="stat-value" style={{ color: '#ef4444' }}>{ausentes}</div>
            </div>
            <div className="stat-card" style={{ flex: 1, minWidth: 120 }}>
              <div className="stat-label">% Presença</div>
              <div className="stat-value" style={{ color: 'var(--purple-300)' }}>
                {rows.length > 0 ? Math.round((presentes / rows.length) * 100) : 0}%
              </div>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Discípulo</th>
                  <th>Discipulador</th>
                  <th>Gerente</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Nenhum resultado encontrado</td></tr>
                ) : rows.map((r) => (
                  <tr key={r.id}>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {new Date(r.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ fontWeight: 600 }}>{r.discipuloIdent.nome}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{r.discipulador.nome}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{r.discipulador.gerente?.nome}</td>
                    <td>
                      <span className={`badge ${r.presente ? 'badge-green' : 'badge-red'}`}>
                        {r.presente ? '✓ Presente' : '✗ Ausente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
