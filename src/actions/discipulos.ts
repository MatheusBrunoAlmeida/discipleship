'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

export async function getDiscipulosByDiscipulador(discipuladorId: number) {
  return await prisma.discipulo.findMany({
    where: { discipuladorId },
    orderBy: { nome: 'asc' },
  })
}

export async function getAllDiscipulos() {
  return await prisma.discipulo.findMany({
    orderBy: { nome: 'asc' },
  })
}

export async function createDiscipulo(data: {
  nome: string
  telefone: string
  idade: number
  sexo: string
  estrutura: string
  goe: boolean
  visitante: boolean
  discipuladorId: number
}) {
  await prisma.discipulo.create({ data })
  revalidatePath('/painel')
}

export async function createDiscipuloAdmin(data: {
  nome: string
  telefone: string
  idade: number
  sexo: string
  estrutura: string
  goe: boolean
  visitante: boolean
  discipuladorId: number
}) {
  await prisma.discipulo.create({ data })
  revalidatePath('/admin/discipulos')
}

export async function updateDiscipulo(
  id: string,
  data: Prisma.DiscipuloUpdateInput
) {
  await prisma.discipulo.update({ where: { id }, data })
  revalidatePath('/painel')
}

export async function deleteDiscipulo(id: string) {
  await prisma.discipulo.delete({ where: { id } })
  revalidatePath('/painel')
}
