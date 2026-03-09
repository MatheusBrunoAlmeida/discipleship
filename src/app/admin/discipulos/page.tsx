'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getGerentes } from '@/actions/gerentes'
import { getDiscipuladores } from '@/actions/discipuladores'
import { getAllDiscipulos } from '@/actions/discipulos'
import DiscipuloActions from '@/app/painel/discipulos/DiscipuloActions'

type Gerente = { id: number; nome: string }
type Discipulador = { id: number; nome: string; sexo: string; gerenteId: number }
type Discipulo = {
  id: string
  nome: string
  telefone: string
  idade: number
  sexo: string
  estrutura: string
  goe: boolean
  visitante: boolean
  discipuladorId: number
  discipulador?: Discipulador
}

export default function AdminDiscipulosPage() {
  const [gerentes, setGerentes] = useState<Gerente[]>([])
  const [discipuladores, setDiscipuladores] = useState<Discipulador[]>([])
  const [discipulos, setDiscipulos] = useState<Discipulo[]>([])

  const [filtroSexo, setFiltroSexo] = useState('')
  const [filtroGerente, setFiltroGerente] = useState('')
  const [filtroDiscipulador, setFiltroDiscipulador] = useState('')

  const load = async () => {
    const [g, d, disc] = await Promise.all([
      getGerentes(),
      getDiscipuladores(),
      getAllDiscipulos()
    ])
    setGerentes(g as Gerente[])
    setDiscipuladores(d as Discipulador[])
    setDiscipulos(disc as Discipulo[])
  }

  useEffect(() => {
    load()
  }, [])

  // Reset trailing filters when parent filter changes
  useEffect(() => { setFiltroGerente(''); setFiltroDiscipulador('') }, [filtroSexo])
  useEffect(() => { setFiltroDiscipulador('') }, [filtroGerente])

  const dispFiltradosPorSexo = discipuladores.filter(d => d.sexo === filtroSexo)
  const dispFiltrados = dispFiltradosPorSexo.filter(d => d.gerenteId === Number(filtroGerente))

  // Determine what disciples to show
  let discipulosExibidos: Discipulo[] = []

  if (filtroDiscipulador) {
    discipulosExibidos = discipulos.filter(d => d.discipuladorId === Number(filtroDiscipulador))
  } else if (filtroGerente) {
    // If gerente is selected but no specific discipulador, show all from that gerente
    const idsDiscipuladores = dispFiltrados.map(d => d.id)
    discipulosExibidos = discipulos.filter(d => idsDiscipuladores.includes(d.discipuladorId))
  } else if (filtroSexo) {
    // If only sexo is selected, show all from discipuladores of that sex
    const idsDiscipuladores = dispFiltradosPorSexo.map(d => d.id)
    discipulosExibidos = discipulos.filter(d => idsDiscipuladores.includes(d.discipuladorId))
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Discípulos (Admin)</h1>
          <p className="page-subtitle">Visualize e edite todos os discípulos cadastrados</p>
        </div>
        <Link href="/admin/discipulos/novo" className="btn-primary" style={{ fontSize: '0.875rem' }}>
          + Novo Discípulo
        </Link>
      </div>

      {/* Filtros em Cascata */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#374151' }}>Filtros</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>

          <div>
            <label className="label">1. Tipo de discipulado </label>
            <select className="input" value={filtroSexo} onChange={(e) => setFiltroSexo(e.target.value)}>
              <option value="">Selecione...</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
          </div>

          <div>
            <label className="label">2. Gerente</label>
            <select className="input" value={filtroGerente} onChange={(e) => setFiltroGerente(e.target.value)} disabled={!filtroSexo}>
              <option value="">Selecione o gerente...</option>
              {gerentes.map(g => (
                <option key={g.id} value={g.id}>{g.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">3. Discipulador</label>
            <select className="input" value={filtroDiscipulador} onChange={(e) => setFiltroDiscipulador(e.target.value)} disabled={!filtroGerente}>
              <option value="">Selecione o discipulador...</option>
              {dispFiltrados.map(d => (
                <option key={d.id} value={d.id}>{d.nome}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Resultados */}
      {!filtroSexo ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', background: '#f9fafb', borderRadius: 12, border: '1px dashed #e5e7eb' }}>
          <p>Selecione os filtros acima para listar os discípulos.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Idade</th>
                <th>Estrutura</th>
                <th>Discipulador</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {discipulosExibidos.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    Nenhum discípulo encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                discipulosExibidos.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 600 }}>{d.nome}</td>
                    <td style={{ color: '#6b7280' }}>{d.telefone}</td>
                    <td>{d.idade}</td>
                    <td><span className="badge" style={{ background: '#f3f4f6', color: '#4b5563' }}>{d.estrutura}</span></td>
                    <td style={{ color: '#6b7280', fontSize: '0.9rem' }}>{d.discipulador?.nome || 'N/A'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {d.goe && <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>GOE</span>}
                        {d.visitante && <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Visitante</span>}
                        {!d.goe && !d.visitante && <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>-</span>}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <DiscipuloActions discipulo={d} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
