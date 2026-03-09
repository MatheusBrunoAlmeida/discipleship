import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function HomePage() {
  const session = await auth()

  if (session?.user?.role === 'admin') {
    redirect('/admin')
  }

  if (session?.user?.role === 'discipulador') {
    redirect('/painel')
  }

  redirect('/login')
}
