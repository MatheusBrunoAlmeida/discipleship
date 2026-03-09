'use client'

import { useState } from 'react'
import { createDiscipulo } from '@/actions/discipulos'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function NovoDiscipuloPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [form, setForm] = useState({
    nome: '', telefone: '', idade: '', sexo: 'Masculino', estrutura: '', goe: false, visitante: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const discipuladorId = session?.user?.discipuladorId
    if (!discipuladorId) { setError('Sessão inválida'); return }
    setLoading(true)
    setError('')
    try {
      await createDiscipulo({
        nome: form.nome,
        telefone: form.telefone,
        idade: Number(form.idade),
        sexo: form.sexo,
        estrutura: form.estrutura,
        goe: form.goe,
        visitante: form.visitante,
        discipuladorId,
      })
      router.push('/painel/discipulos')
    } catch (err) {
      setError('Erro ao salvar. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex' }}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="page-title">Novo Discípulo</h1>
          <p className="page-subtitle">Preencha os dados abaixo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Nome completo *</label>
            <input
              className="input"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required placeholder="Nome do discípulo"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="label">Telefone *</label>
              <input
                className="input"
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                required placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <label className="label">Idade *</label>
              <input
                className="input"
                type="number"
                value={form.idade}
                onChange={(e) => setForm({ ...form, idade: e.target.value })}
                required placeholder="Ex: 25"
                min={1} max={120}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="label">Sexo *</label>
              <select
                className="input"
                value={form.sexo}
                onChange={(e) => setForm({ ...form, sexo: e.target.value })}
                required
              >
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </select>
            </div>
            <div>
              <label className="label">Estrutura *</label>
              <input
                className="input"
                value={form.estrutura}
                onChange={(e) => setForm({ ...form, estrutura: e.target.value })}
                required placeholder="Ex: Célula Norte"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '0.875rem', background: '#f9fafb', borderRadius: 10, border: '1px solid #e5e7eb' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>GOE</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 2 }}>Grupo de Oração e Estudo</div>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={form.goe} onChange={(e) => setForm({ ...form, goe: e.target.checked })} />
                  <span className="toggle-slider" />
                </label>
              </label>
            </div>

            <div style={{ padding: '0.875rem', background: '#f9fafb', borderRadius: 10, border: '1px solid #e5e7eb' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Visitante</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 2 }}>Marcado como visitante</div>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={form.visitante} onChange={(e) => setForm({ ...form, visitante: e.target.checked })} />
                  <span className="toggle-slider" />
                </label>
              </label>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ padding: '0.875rem', fontSize: '1rem', marginTop: 4 }}
          >
            {loading ? '💾 Salvando...' : '✅ Cadastrar Discípulo'}
          </button>
        </div>
      </form>
    </div>
  )
}
