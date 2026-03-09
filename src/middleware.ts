import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const pathname = nextUrl.pathname
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role

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
