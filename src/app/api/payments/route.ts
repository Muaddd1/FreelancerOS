import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const payments = await prisma.payment.findMany({
    include: { invoice: true, client: true },
    orderBy: { date: 'desc' },
  })
  return NextResponse.json(payments)
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const payment = await prisma.payment.create({
      data: {
        ...data,
        workspaceId: data.workspaceId || 'demo-workspace',
        userId: data.userId || 'demo-user',
      },
    })
    // If payment linked to invoice, update invoice paid amount
    if (data.invoiceId) {
      const invoice = await prisma.invoice.findUnique({ where: { id: data.invoiceId } })
      if (invoice) {
        await prisma.invoice.update({
          where: { id: data.invoiceId },
          data: { paid: invoice.paid + data.amount, paidAt: new Date() },
        })
      }
    }
    return NextResponse.json(payment, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
  }
}
