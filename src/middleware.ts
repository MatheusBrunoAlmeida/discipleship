import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export default auth((req) => {
  const { nextUrl, auth: session } = req as any
  const pathname = nextUrl.pathname

  const isLoggedIn = !!session
  const role = session?.user?.role

  // Admin routes require admin role
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn || role !== 'admin') {
      return NextResponse.redirect(new URL('/login?tipo=admin', req.url))
    }
  }

  // Painel routes require discipulador role
  if (pathname.startsWith('/painel')) {
    if (!isLoggedIn || role !== 'discipulador') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/painel/:path*'],
}
