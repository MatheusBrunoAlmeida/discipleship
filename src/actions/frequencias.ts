'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function generateChamadaForDiscipulador(
  discipuladorId: number,
  data: Date,
  presencas: { discipuloId: string; presente: boolean }[]
) {
  // Use transaction to ensure all records use the same data
  await prisma.$transaction(
    presencas.map((p) =>
      prisma.frequencia.upsert({
        where: {
          discipuloId_data: {
            discipuloId: p.discipuloId,
            data,
          },
        },
        update: {
          presente: p.presente,
        },
        create: {
          data,
          presente: p.presente,
          discipuloId: p.discipuloId,
          discipuladorId,
        },
      })
    )
  )

  revalidatePath('/painel/chamada')
}

export async function getFrequenciasByDiscipulo(discipuloId: string) {
  return await prisma.frequencia.findMany({
    where: { discipuloId },
    orderBy: { data: 'desc' },
  })
}

export async function getFrequenciasRecentes(discipuloId: string) {
  return await prisma.frequencia.findMany({
    where: { discipuloId },
    orderBy: { data: 'desc' },
    take: 4, // Last 4 cells
  })
}

export async function getFrequenciaByDate(discipuladorId: number, data: Date) {
  return prisma.frequencia.findMany({
    where: { discipuladorId, data },
  })
}

export async function getPresencasByData(discipuladorId: number, data: Date) {
  const frequencias = await prisma.frequencia.findMany({
    where: { discipuladorId, data },
    select: { discipuloId: true, presente: true },
  })

  const map: Record<string, boolean> = {}
  frequencias.forEach((f) => {
    map[f.discipuloId] = f.presente
  })
  return map
}

export async function getRelatorio(filters: {
  gerenteId?: number
  discipuladorId?: number
  data?: Date
}) {
  const where: any = {}
  if (filters.discipuladorId) where.discipuladorId = filters.discipuladorId
  if (filters.data) where.data = filters.data

  return prisma.frequencia.findMany({
    where,
    include: {
      discipuloIdent: true,
      discipulador: { include: { gerente: true } },
    },
    orderBy: [{ data: 'desc' }, { discipuloIdent: { nome: 'asc' } }],
  })
}
