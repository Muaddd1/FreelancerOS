import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const expenses = await prisma.expense.findMany({
    include: { project: true },
    orderBy: { date: 'desc' },
  })
  return NextResponse.json(expenses)
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const expense = await prisma.expense.create({
      data: {
        ...data,
        workspaceId: data.workspaceId || 'demo-workspace',
        userId: data.userId || 'demo-user',
      },
    })
    return NextResponse.json(expense, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 })
  }
}
