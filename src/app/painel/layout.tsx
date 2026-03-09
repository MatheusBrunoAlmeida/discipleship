import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import PainelNav from '@/components/PainelNav'

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (session?.user?.role !== 'discipulador') redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M17 20H7C5.9 20 5 19.1 5 18V8L9 4H17C18.1 4 19 4.9 19 6V18C19 19.1 18.1 20 17 20Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M9 13H15M9 16H12" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">FreqDisc</div>
            <div className="text-xs text-indigo-600 font-medium">{session.user.name}</div>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <div className="painel-content">
          {children}
        </div>
      </main>

      <PainelNav />
    </div>
  )
}
