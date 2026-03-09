'use client'

import { useState, useEffect } from 'react'
import { getGerentes, createGerente, updateGerente, deleteGerente } from '@/actions/gerentes'

type Gerente = { id: number; nome: string; telefone: string; idadeDiscipulado: string }

export default function GerentesPage() {
  const [gerentes, setGerentes] = useState<Gerente[]>([])
  const [modal, setModal] = useState<null | 'create' | Gerente>(null)
  const [form, setForm] = useState({ nome: '', telefone: '', idadeDiscipulado: '' })
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)

  const load = async () => {
    const data = await getGerentes()
    setGerentes(data as Gerente[])
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setForm({ nome: '', telefone: '', idadeDiscipulado: '' })
    setModal('create')
  }

  const openEdit = (g: Gerente) => {
    setForm({ nome: g.nome, telefone: g.telefone, idadeDiscipulado: g.idadeDiscipulado })
    setModal(g)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (modal === 'create') {
      await createGerente(form)
    } else if (typeof modal !== 'string' && modal !== null) {
      await updateGerente(modal.id, form)
    }
    setModal(null)
    setLoading(false)
    await load()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja remover este gerente?')) return
    setDeleting(id)
    await deleteGerente(id)
    setDeleting(null)
    await load()
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Gerentes</h1>
          <p className="page-subtitle">{gerentes.length} gerente{gerentes.length !== 1 ? 's' : ''} cadastrado{gerentes.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Novo Gerente
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Faixa Etária</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {gerentes.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  Nenhum gerente cadastrado
                </td>
              </tr>
            ) : gerentes.map((g) => (
              <tr key={g.id}>
                <td style={{ fontWeight: 600 }}>{g.nome}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{g.telefone}</td>
                <td><span className="badge badge-purple">{g.idadeDiscipulado}</span></td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button className="btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8rem' }} onClick={() => openEdit(g)}>
                      Editar
                    </button>
                    <button
                      className="btn-danger"
                      style={{ padding: '0.375rem 0.75rem', fontSize: '0.8rem' }}
                      onClick={() => handleDelete(g.id)}
                      disabled={deleting === g.id}
                    >
                      {deleting === g.id ? '...' : 'Remover'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal !== null && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{modal === 'create' ? 'Novo Gerente' : 'Editar Gerente'}</h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}>×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Nome completo</label>
                <input className="input" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required placeholder="Nome do gerente" />
              </div>
              <div>
                <label className="label">Telefone</label>
                <input className="input" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} required placeholder="(00) 00000-0000" />
              </div>
              <div>
                <label className="label">Faixa Etária do Discipulado</label>
                <select className="input" value={form.idadeDiscipulado} onChange={(e) => setForm({ ...form, idadeDiscipulado: e.target.value })} required>
                  <option value="">Selecione...</option>
                  <option value="9-11">9-11</option>
                  <option value="11-13">11-13</option>
                  <option value="13-15">13-15</option>
                  <option value="15+">15+</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button type="button" className="btn-secondary" onClick={() => setModal(null)} style={{ flex: 1 }}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
