'use client'

import { useState, useEffect } from 'react'
import { getDiscipuladores, createDiscipulador, updateDiscipulador, deleteDiscipulador } from '@/actions/discipuladores'
import { getGerentes } from '@/actions/gerentes'

type Gerente = { id: number; nome: string; idadeDiscipulado: string }
type Disc = {
  id: number; nome: string; telefone: string; email: string
  sexo: string; idadeDiscipulado: string; nomeDiscipulado: string; gerenteId: number
  gerente: Gerente
}

const emptyForm = { nome: '', telefone: '', email: '', senha: '', sexo: 'Masculino', idadeDiscipulado: '', nomeDiscipulado: '', gerenteId: '' }

function DiscTable({ list, onEdit, onDelete }: { list: Disc[]; onEdit: (d: Disc) => void; onDelete: (id: number) => void }) {
  if (list.length === 0) return (
    <tr><td colSpan={5} style={{ textAlign: 'center', color: '#9ca3af', padding: '1.5rem' }}>Nenhum cadastrado</td></tr>
  )
  return (
    <>
      {list.map((d) => (
        <tr key={d.id}>
          <td style={{ fontWeight: 600 }}>{d.nome}</td>
          <td style={{ color: '#6b7280', fontSize: '0.8rem' }}>{d.email}</td>
          <td style={{ color: '#6b7280' }}>{d.gerente?.nome}</td>
          <td><span className="badge badge-purple" style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{d.nomeDiscipulado}</span></td>
          <td style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8rem' }} onClick={() => onEdit(d)}>Editar</button>
              <button className="btn-danger" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8rem' }} onClick={() => onDelete(d.id)}>Remover</button>
            </div>
          </td>
        </tr>
      ))}
    </>
  )
}

export default function DiscipuladoresPage() {
  const [list, setList] = useState<Disc[]>([])
  const [gerentes, setGerentes] = useState<Gerente[]>([])
  const [modal, setModal] = useState<null | 'create' | Disc>(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    const [d, g] = await Promise.all([getDiscipuladores(), getGerentes()])
    setList(d as any)
    setGerentes(g as any)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(emptyForm); setModal('create') }

  const openEdit = (d: Disc) => {
    setForm({ nome: d.nome, telefone: d.telefone, email: d.email, senha: '', sexo: d.sexo, idadeDiscipulado: d.idadeDiscipulado, nomeDiscipulado: d.nomeDiscipulado, gerenteId: String(d.gerenteId) })
    setModal(d)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const data = { ...form, gerenteId: Number(form.gerenteId) }
    if (modal === 'create') {
      await createDiscipulador(data as any)
    } else if (typeof modal !== 'string' && modal !== null) {
      await updateDiscipulador(modal.id, data as any)
    }
    setModal(null); setLoading(false); await load()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Remover este discipulador? Todos seus discípulos e presenças serão removidos.')) return
    await deleteDiscipulador(id); await load()
  }

  const masculinos = list.filter((d) => d.sexo === 'Masculino')
  const femininas = list.filter((d) => d.sexo === 'Feminino')

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Discipuladores</h1>
          <p className="page-subtitle">{list.length} discipulador{list.length !== 1 ? 'es' : ''} cadastrado{list.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Novo Discipulador
        </button>
      </div>

      {/* Masculinos */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '1.1rem' }}>🙋‍♂️</span>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#3730a3' }}>Masculinos</h2>
          <span className="badge badge-purple">{masculinos.length}</span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome</th><th>Email</th><th>Gerente</th><th>Discipulado</th><th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              <DiscTable list={masculinos} onEdit={openEdit} onDelete={handleDelete} />
            </tbody>
          </table>
        </div>
      </div>

      {/* Femininas */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '1.1rem' }}>🙋‍♀️</span>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#9d174d' }}>Femininas</h2>
          <span className="badge" style={{ background: '#fce7f3', color: '#9d174d' }}>{femininas.length}</span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome</th><th>Email</th><th>Gerente</th><th>Discipulado</th><th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              <DiscTable list={femininas} onEdit={openEdit} onDelete={handleDelete} />
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal !== null && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{modal === 'create' ? 'Novo Discipulador' : 'Editar Discipulador'}</h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}>×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div>
                  <label className="label">Nome</label>
                  <input className="input" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required placeholder="Nome completo" />
                </div>
                <div>
                  <label className="label">Telefone</label>
                  <input className="input" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} required placeholder="(00) 00000-0000" />
                </div>
              </div>
              <div>
                <label className="label">Email (login)</label>
                <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="email@exemplo.com" />
              </div>
              <div>
                <label className="label">Senha {modal !== 'create' && '(deixe em branco para manter)'}</label>
                <input className="input" type="password" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} required={modal === 'create'} placeholder="••••••••" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div>
                  <label className="label">Sexo</label>
                  <select className="input" value={form.sexo} onChange={(e) => setForm({ ...form, sexo: e.target.value })} required>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                  </select>
                </div>
                <div>
                  <label className="label">Gerente</label>
                  <select className="input" value={form.gerenteId} onChange={(e) => setForm({ ...form, gerenteId: e.target.value })} required>
                    <option value="">Selecione...</option>
                    {gerentes.map((g) => <option key={g.id} value={g.id}>{g.nome}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div>
                  <label className="label">Nome do Discipulado</label>
                  <input className="input" value={form.nomeDiscipulado} onChange={(e) => setForm({ ...form, nomeDiscipulado: e.target.value })} required placeholder="Ex: Levitas" />
                </div>
                <div>
                  <label className="label">Faixa Etária</label>
                  <select className="input" value={form.idadeDiscipulado} onChange={(e) => setForm({ ...form, idadeDiscipulado: e.target.value })} required>
                    <option value="">Selecione...</option>
                    <option value="9-11">9-11</option>
                    <option value="11-13">11-13</option>
                    <option value="13-15">13-15</option>
                    <option value="15+">15+</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button type="button" className="btn-secondary" onClick={() => setModal(null)} style={{ flex: 1 }}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>{loading ? 'Salvando...' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
