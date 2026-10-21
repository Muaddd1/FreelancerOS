import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { lineItems, toData } from '@/lib/prisma-data'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      project: true,
      items: true,
      payments: true,
      reminders: true,
    },
  })
  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(invoice)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json()
    const items = lineItems(data.items)
    const invoice = await prisma.invoice.update({
      where: { id: params.id },
      data: { ...toData('Invoice', data), ...(items && { items: { deleteMany: {}, create: items } }) },
    })
    return NextResponse.json(invoice)
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.invoice.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
