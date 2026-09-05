import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      projects: { include: { tasks: true } },
      invoices: { include: { payments: true } },
      proposals: true,
      contracts: true,
      payments: true,
      files: true,
      activities: { orderBy: { createdAt: 'desc' }, take: 20 },
      messages: { orderBy: { createdAt: 'desc' } },
      _count: { select: { projects: true, invoices: true } },
    },
  })
  if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(client)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json()
    const client = await prisma.client.update({ where: { id: params.id }, data })
    return NextResponse.json(client)
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.client.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
