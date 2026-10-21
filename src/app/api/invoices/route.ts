import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { lineItems, toData } from '@/lib/prisma-data'

export async function GET() {
  const invoices = await prisma.invoice.findMany({
    include: {
      client: true,
      project: true,
      items: true,
      payments: true,
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(invoices)
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const items = lineItems(data.items)
    const invoice = await prisma.invoice.create({
      data: {
        ...toData('Invoice', data),
        workspaceId: data.workspaceId || 'demo-workspace',
        userId: data.userId || 'demo-user',
        ...(items && { items: { create: items } }),
      },
      include: { client: true, items: true },
    })
    return NextResponse.json(invoice, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
  }
}
