import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
        isAdmin: { label: 'Admin', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials) return null

        // Admin login: special email 'admin' + env password
        if (credentials.isAdmin === 'true') {
          const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
          if (credentials.password === adminPassword) {
            return {
              id: 'admin',
              name: 'Administrador',
              email: 'admin',
              role: 'admin',
            }
          }
          return null
        }

        // Discipulador login
        const discipulador = await prisma.discipulador.findUnique({
          where: { email: credentials.email as string },
        })

        if (!discipulador) return null

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          discipulador.senha
        )

        if (!passwordMatch) return null

        return {
          id: String(discipulador.id),
          name: discipulador.nome,
          email: discipulador.email,
          role: 'discipulador',
          discipuladorId: discipulador.id,
        }
      },
    }),
  ],
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
})
