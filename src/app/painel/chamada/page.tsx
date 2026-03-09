'use client'
'use client'

import { useState, useEffect } from 'react'
import { getCurrentOrLastFriday, formatDate } from '@/lib/utils'
import { getFrequenciaByDate, generateChamadaForDiscipulador } from '@/actions/frequencias'
import { getDiscipulosByDiscipulador } from '@/actions/discipulos'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Discipulo = { id: string; nome: string; telefone: string; goe: boolean; visitante: boolean }

export default function ChamadaPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [dataReuniao, setDataReuniao] = useState<string>('')
  const [discipulos, setDiscipulos] = useState<any[]>([])
  const [presencas, setPresencas] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false) // Restored setSaved

  const friday = getCurrentOrLastFriday() // Restored friday calculation

  useEffect(() => {
    setDataReuniao(formatDate(friday))
  }, [friday])

  useEffect(() => {
    async function load() {
      if (session?.user?.id && dataReuniao) {
        setLoading(true)
        const list = await getDiscipulosByDiscipulador(Number(session.user.id))
        setDiscipulos(list)
        // Check existing frequency
        const freq = await getFrequenciaByDate(Number(session.user.id), new Date(dataReuniao))
        const pMap: Record<string, boolean> = {}
        list.forEach((d: any) => {
          const f = freq.find((f) => f.discipuloId === d.id)
          pMap[d.id] = f ? f.presente : false
        })
        setPresencas(pMap)
      }
      setLoading(false)
    }
    load()
  }, [session, dataReuniao])

  const toggle = (id: string) => {
    setPresencas((prev) => ({ ...prev, [id]: !prev[id] }))
    setSaved(false)
  }

  const handleSave = async () => {
    if (!session?.user?.id) return
    setSaving(true)
    try {
      const payload = Object.entries(presencas).map(([id, presente]) => ({ discipuloId: id, presente }))
      await generateChamadaForDiscipulador(Number(session.user.id), new Date(dataReuniao), payload)
      setSaved(true) // Success state
      router.refresh()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const presentes = Object.values(presencas).filter(Boolean).length
  const total = discipulos.length

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">Fazer Chamada</h1>
        <p className="page-subtitle">Selecione os presentes na célula</p>
      </div>

      <div className="card mb-6" style={{ padding: '1rem' }}>
        <div className="flex flex-col gap-1 mb-4">
          <label className="label">Data da Célula</label>
          <input
            type="date"
            className="input w-full"
            value={dataReuniao}
            onChange={(e) => {
              setDataReuniao(e.target.value)
              setSaved(false)
            }}
          />
        </div>

        <div className="flex items-center justify-between text-sm py-2 px-3 bg-gray-50 rounded-lg border border-gray-100 mb-2 mt-4 mb-2">
          <span className="font-semibold text-gray-700">Presentes:</span>
          <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
            {presentes} / {total}
          </span>
        </div>
      </div>

      {/* Quick select */}
      <div className="flex gap-2 mb-4">
        <button
          className="btn-secondary flex-1 text-xs py-1.5 justify-center"
          onClick={() => { setPresencas(Object.fromEntries(discipulos.map((d) => [d.id, true]))); setSaved(false) }}
        >
          ✅ Todos presentes
        </button>
        <button
          className="btn-secondary flex-1 text-xs py-1.5 justify-center"
          onClick={() => { setPresencas(Object.fromEntries(discipulos.map((d) => [d.id, false]))); setSaved(false) }}
        >
          ❌ Todos ausentes
        </button>
      </div>

      <div className="flex flex-col gap-2.5 mb-8">
        {discipulos.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-300">
            Nenhum discípulo encontrado.<br />Cadastre discípulos primeiro.
          </div>
        ) : (
          discipulos.map((d) => {
            const isPresente = presencas[d.id]

            return (
              <div
                key={d.id}
                onClick={() => toggle(d.id)}
                className={`flex items - center justify - between p - 3.5 rounded - xl border transition - all cursor - pointer ${isPresente
                  ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-indigo-300'
                  } `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w - 10 h - 10 rounded - full flex items - center justify - center font - bold text - sm transition - colors ${isPresente
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-500'
                    } `}>
                    {d.nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className={`font - semibold text - sm ${isPresente ? 'text-indigo-900' : 'text-gray-900'} `}>
                      {d.nome}
                    </div>
                    <div className="flex gap-1 mt-1">
                      {d.goe && <span className="badge badge-yellow" style={{ fontSize: '0.6rem' }}>GOE</span>}
                      {d.visitante && <span className="badge badge-purple" style={{ fontSize: '0.6rem' }}>Visitante</span>}
                      {!d.goe && !d.visitante && (
                        <span className="text-xs text-gray-400">Regular</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Custom Checkbox */}
                <div className={`w - 6 h - 6 rounded - full border - 2 flex items - center justify - center transition - colors ${isPresente
                  ? 'border-indigo-600 bg-indigo-600'
                  : 'border-gray-300 bg-white'
                  } `}>
                  {isPresente && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Alert Component */}
      {saved && (
        <div className="alert alert-success mt-4 mb-4 text-center">
          ✅ Frequência salva com sucesso!
        </div>
      )}

      {saving && (
        <div className="flex justify-center mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      <button
        className="btn-primary w-full py-3 text-base justify-center"
        onClick={handleSave}
        disabled={saving || discipulos.length === 0}
      >
        {saving ? 'Salvando...' : '💾 Salvar Chamada'}
      </button>
    </div>
  )
}
