import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { toData } from '@/lib/prisma-data'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const expense = await prisma.expense.findUnique({
    where: { id: params.id },
    include: { project: true },
  })
  if (!expense) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(expense)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json()
    const expense = await prisma.expense.update({ where: { id: params.id }, data: toData('Expense', data) })
    return NextResponse.json(expense)
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.expense.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
