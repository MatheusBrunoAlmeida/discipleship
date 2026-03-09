import type { NextAuthConfig } from 'next-auth'

// Edge-safe config: no Prisma, no bcrypt
// Used by middleware to keep the Edge bundle small
export const authConfig: NextAuthConfig = {
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.discipuladorId = (user as any).discipuladorId
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as string
        session.user.discipuladorId = token.discipuladorId as number | undefined
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
}
