'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getGerentes() {
  return prisma.gerente.findMany({ orderBy: { nome: 'asc' } })
}

export async function createGerente(data: {
  nome: string
  telefone: string
  idadeDiscipulado: string
}) {
  await prisma.gerente.create({ data })
  revalidatePath('/admin/gerentes')
}

export async function updateGerente(
  id: number,
  data: { nome: string; telefone: string; idadeDiscipulado: string }
) {
  await prisma.gerente.update({ where: { id }, data })
  revalidatePath('/admin/gerentes')
}

export async function deleteGerente(id: number) {
  await prisma.gerente.delete({ where: { id } })
  revalidatePath('/admin/gerentes')
}
