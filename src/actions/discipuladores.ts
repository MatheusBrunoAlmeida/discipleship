'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

export async function getDiscipuladores() {
  return prisma.discipulador.findMany({
    include: { gerente: true },
    orderBy: { nome: 'asc' },
  })
}

export async function createDiscipulador(data: {
  nome: string
  telefone: string
  email: string
  senha: string
  sexo: string
  idadeDiscipulado: string
  nomeDiscipulado: string
  gerenteId: number
}) {
  const hashedPassword = await bcrypt.hash(data.senha, 10)
  await prisma.discipulador.create({
    data: { ...data, senha: hashedPassword },
  })
  revalidatePath('/admin/discipuladores')
}

export async function updateDiscipulador(
  id: number,
  data: {
    nome: string
    telefone: string
    email: string
    senha?: string
    sexo: string
    idadeDiscipulado: string
    nomeDiscipulado: string
    gerenteId: number
  }
) {
  const updateData: any = { ...data }
  if (data.senha && data.senha.trim() !== '') {
    updateData.senha = await bcrypt.hash(data.senha, 10)
  } else {
    delete updateData.senha
  }
  await prisma.discipulador.update({ where: { id }, data: updateData })
  revalidatePath('/admin/discipuladores')
}

export async function deleteDiscipulador(id: number) {
  await prisma.discipulador.delete({ where: { id } })
  revalidatePath('/admin/discipuladores')
}
