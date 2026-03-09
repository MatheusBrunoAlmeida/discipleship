import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DiscipuloActions from './DiscipuloActions'

export default async function DiscipulosPage() {
  const session = await auth()
  if (!session?.user?.discipuladorId) redirect('/login')

  const discipuladorId = session.user.discipuladorId!
  const discipulos = await prisma.discipulo.findMany({
    where: { discipuladorId },
    orderBy: { nome: 'asc' },
  })

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Discípulos</h1>
          <p className="page-subtitle">{discipulos.length} cadastrado{discipulos.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/painel/discipulos/novo" className="btn-primary" style={{ fontSize: '0.875rem' }}>
          + Novo
        </Link>
      </div>

      {discipulos.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🤝</div>
          <p style={{ color: 'var(--text-muted)' }}>Nenhum discípulo cadastrado ainda</p>
          <Link href="/painel/discipulos/novo" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
            Cadastrar primeiro
          </Link>
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
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {discipulos.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--purple-700), var(--purple-600))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.875rem', fontWeight: 700, color: 'white', flexShrink: 0,
                      }}>
                        {d.nome.charAt(0).toUpperCase()}
                      </div>
                      {d.nome}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{d.telefone}</td>
                  <td>{d.idade} anos</td>
                  <td><span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{d.estrutura}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {d.goe && <span className="badge badge-yellow" style={{ fontSize: '0.7rem' }}>GOE</span>}
                      {d.visitante && <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>Visitante</span>}
                      {!d.goe && !d.visitante && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>-</span>}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <DiscipuloActions discipulo={{ id: d.id, nome: d.nome, telefone: d.telefone, idade: d.idade, sexo: d.sexo, estrutura: d.estrutura, goe: d.goe, visitante: d.visitante }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
