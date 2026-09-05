import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const [
    totalClients,
    totalProjects,
    totalInvoices,
    totalRevenue,
    totalExpenses,
    activeProjects,
    pendingInvoices,
    recentActivities,
  ] = await Promise.all([
    prisma.client.count(),
    prisma.project.count(),
    prisma.invoice.count(),
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.expense.aggregate({ _sum: { amount: true } }),
    prisma.project.count({ where: { status: 'ACTIVE' } }),
    prisma.invoice.count({ where: { status: { in: ['SENT', 'OVERDUE'] } } }),
    prisma.activity.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
  ])

  return NextResponse.json({
    totalClients,
    totalProjects,
    totalInvoices,
    totalRevenue: totalRevenue._sum.amount || 0,
    totalExpenses: totalExpenses._sum.amount || 0,
    activeProjects,
    pendingInvoices,
    recentActivities,
    profit: (totalRevenue._sum.amount || 0) - (totalExpenses._sum.amount || 0),
  })
}
