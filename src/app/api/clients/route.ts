import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const clients = await prisma.client.findMany({
    include: {
      projects: { select: { id: true } },
      invoices: { select: { total: true, paid: true } },
      _count: { select: { projects: true, invoices: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(clients)
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const client = await prisma.client.create({
      data: {
        ...data,
        workspaceId: data.workspaceId || 'demo-workspace',
        userId: data.userId || 'demo-user',
      },
    })
    return NextResponse.json(client, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 })
  }
}
