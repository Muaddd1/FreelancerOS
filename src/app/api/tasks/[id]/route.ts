import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { toData } from '@/lib/prisma-data'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const task = await prisma.task.findUnique({
    where: { id: params.id },
    include: { project: true, client: true, timeEntries: true },
  })
  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(task)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json()
    const task = await prisma.task.update({ where: { id: params.id }, data: toData('Task', data) })
    return NextResponse.json(task)
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.task.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
