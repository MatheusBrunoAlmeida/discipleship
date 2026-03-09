'use client'

import { useState } from 'react'
import { updateDiscipulo, deleteDiscipulo } from '@/actions/discipulos'
import { useRouter } from 'next/navigation'

type Disc = { id: string; nome: string; telefone: string; idade: number; sexo: string; estrutura: string; goe: boolean; visitante: boolean }

export default function DiscipuloActions({ discipulo }: { discipulo: Disc }) {
  const router = useRouter()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ ...discipulo })
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { id, ...dataToUpdate } = form // Destructure id from form
    await updateDiscipulo(discipulo.id, { ...dataToUpdate, idade: Number(form.idade) }) // Pass dataToUpdate
    setLoading(false)
    setModal(false)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm(`Remover ${discipulo.nome}?`)) return
    await deleteDiscipulo(discipulo.id)
    router.refresh()
  }

  return (
    <>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button className="btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8rem' }} onClick={() => setModal(true)}>
          Editar
        </button>
        <button className="btn-danger" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8rem' }} onClick={handleDelete}>
          ×
        </button>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Editar Discípulo</h2>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}>×</button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label className="label">Nome</label>
                <input className="input" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div>
                  <label className="label">Telefone</label>
                  <input className="input" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Idade</label>
                  <input className="input" type="number" value={form.idade} onChange={(e) => setForm({ ...form, idade: Number(e.target.value) })} required min={1} max={120} />
                </div>
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
                  <label className="label">Estrutura</label>
                  <input className="input" value={form.estrutura} onChange={(e) => setForm({ ...form, estrutura: e.target.value })} required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem', color: '#6b7280' }}>
                  <input type="checkbox" checked={form.goe} onChange={(e) => setForm({ ...form, goe: e.target.checked })} />
                  GOE
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem', color: '#6b7280' }}>
                  <input type="checkbox" checked={form.visitante} onChange={(e) => setForm({ ...form, visitante: e.target.checked })} />
                  Visitante
                </label>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button type="button" className="btn-secondary" onClick={() => setModal(false)} style={{ flex: 1 }}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>{loading ? 'Salvando...' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
