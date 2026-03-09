'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createDiscipuloAdmin } from '@/actions/discipulos'
import { getDiscipuladores } from '@/actions/discipuladores'

type Discipulador = { id: number; nome: string; sexo: string; gerenteId: number }

export default function AdminNovoDiscipuloPage() {
  const router = useRouter()
  const [discipuladores, setDiscipuladores] = useState<Discipulador[]>([])
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    idade: '',
    sexo: 'Masculino',
    estrutura: '',
    goe: false,
    visitante: false,
    discipuladorId: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getDiscipuladores().then((d) => setDiscipuladores(d as Discipulador[]))
  }, [])

  // Filter discipuladores by selected sex
  const discipuladoresFiltrados = discipuladores.filter((d) => d.sexo === form.sexo)

  // Reset discipuladorId when sex changes
  const handleSexoChange = (sexo: string) => {
    setForm((f) => ({ ...f, sexo, discipuladorId: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.discipuladorId) { setError('Selecione um discipulador.'); return }
    setLoading(true)
    setError('')
    try {
      await createDiscipuloAdmin({
        nome: form.nome,
        telefone: form.telefone,
        idade: Number(form.idade),
        sexo: form.sexo,
        estrutura: form.estrutura,
        goe: form.goe,
        visitante: form.visitante,
        discipuladorId: Number(form.discipuladorId),
      })
      router.push('/admin/discipulos')
    } catch {
      setError('Erro ao salvar. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex' }}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="page-title">Novo Discípulo</h1>
          <p className="page-subtitle">Cadastre um discípulo e vincule a um discipulador</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Nome */}
          <div>
            <label className="label">Nome completo *</label>
            <input
              className="input"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
              placeholder="Nome do discípulo"
            />
          </div>

          {/* Telefone + Idade */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="label">Telefone *</label>
              <input
                className="input"
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                required
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <label className="label">Idade *</label>
              <input
                className="input"
                type="number"
                value={form.idade}
                onChange={(e) => setForm({ ...form, idade: e.target.value })}
                required
                placeholder="Ex: 25"
                min={1}
                max={120}
              />
            </div>
          </div>

          {/* Sexo + Estrutura */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="label">Sexo *</label>
              <select
                className="input"
                value={form.sexo}
                onChange={(e) => handleSexoChange(e.target.value)}
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
                required
                placeholder="Ex: Célula Norte"
              />
            </div>
          </div>

          {/* Discipulador */}
          <div>
            <label className="label">Discipulador *</label>
            <select
              className="input"
              value={form.discipuladorId}
              onChange={(e) => setForm({ ...form, discipuladorId: e.target.value })}
              required
            >
              <option value="">Selecione um discipulador ({form.sexo})...</option>
              {discipuladoresFiltrados.map((d) => (
                <option key={d.id} value={d.id}>{d.nome}</option>
              ))}
            </select>
            {discipuladoresFiltrados.length === 0 && (
              <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                Nenhum discipulador do sexo {form.sexo} cadastrado.
              </p>
            )}
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

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
              style={{ padding: '0.875rem', fontSize: '1rem', flex: 1 }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ padding: '0.875rem', fontSize: '1rem', flex: 2 }}
            >
              {loading ? '💾 Salvando...' : '✅ Cadastrar Discípulo'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
