'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function PainelNav() {
  const pathname = usePathname()

  const items = [
    {
      href: '/painel',
      label: 'Início',
      icon: (active: boolean) => (
        <svg fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: '/painel/chamada',
      label: 'Chamada',
      icon: (active: boolean) => (
        <svg fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      href: '/painel/discipulos',
      label: 'Discípulos',
      icon: (active: boolean) => (
        <svg fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ]

  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const active = item.href === '/painel' ? pathname === '/painel' : pathname.startsWith(item.href)
        return (
          <Link key={item.href} href={item.href} className={`nav-item ${active ? 'active' : ''}`}>
            {item.icon(active)}
            {item.label}
          </Link>
        )
      })}
      <button
        className="nav-item"
        onClick={() => signOut({ callbackUrl: '/login' })}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.65rem' }}
      >
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ width: 22, height: 22 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        SAIR
      </button>
    </nav>
  )
}
