'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Suspense } from 'react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isAdmin = searchParams.get('tipo') === 'admin'

  const [mode, setMode] = useState<'discipulador' | 'admin'>(isAdmin ? 'admin' : 'discipulador')
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await signIn('credentials', {
      email: mode === 'admin' ? 'admin' : form.email,
      password: form.password,
      isAdmin: mode === 'admin' ? 'true' : 'false',
      redirect: false,
    })

    setLoading(false)
    if (res?.error) { setError('Credenciais inválidas. Tente novamente.'); return }
    router.push(mode === 'admin' ? '/admin' : '/painel')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Brand */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
            <path d="M17 20H7C5.9 20 5 19.1 5 18V8L9 4H17C18.1 4 19 4.9 19 6V18C19 19.1 18.1 20 17 20Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M9 4V8H5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 13H15M9 16H12" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Frequência Discipulado</h1>
        <p className="text-sm text-gray-500 mt-1">Sistema de gestão de presença</p>
      </div>

      {/* Mode toggle */}
      <div className="toggle-tab-group">
        {(['discipulador', 'admin'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setError('') }}
            className={`toggle-tab ${mode === m ? 'toggle-tab-active' : 'toggle-tab-inactive'}`}
          >
            {m === 'discipulador' ? '👤 Discipulador' : '🔐 Admin'}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="card flex flex-col gap-4">
          {mode === 'discipulador' && (
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>
          )}

          <div>
            <label className="label">
              {mode === 'admin' ? 'Senha do Administrador' : 'Senha'}
            </label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button
            type="submit"
            className="btn-primary w-full py-2.5 text-base justify-center"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar →'}
          </button>
        </div>
      </form>

      <p className="mt-8 text-xs text-gray-400">
        Frequência Discipulado © {new Date().getFullYear()}
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginContent />
    </Suspense>
  )
}
