import NextAuth from 'next-auth'
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      role: string
      discipuladorId?: number
    } & DefaultSession['user']
  }
}
