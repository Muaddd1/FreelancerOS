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
    invoiceGroups,
    invoiceAvg,
    tasksCompleted,
    projectsCompleted,
    trackedTime,
  ] = await Promise.all([
    prisma.client.count(),
    prisma.project.count(),
    prisma.invoice.count(),
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.expense.aggregate({ _sum: { amount: true } }),
    prisma.project.count({ where: { status: 'ACTIVE' } }),
    prisma.invoice.count({ where: { status: { in: ['SENT', 'OVERDUE'] } } }),
    prisma.activity.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
    prisma.invoice.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.invoice.aggregate({ _avg: { total: true } }),
    prisma.task.count({ where: { status: 'DONE' } }),
    prisma.project.count({ where: { status: 'COMPLETED' } }),
    prisma.timeEntry.aggregate({ _sum: { duration: true } }), // minutes
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
    invoicesByStatus: Object.fromEntries(invoiceGroups.map((g) => [g.status, g._count._all])),
    avgInvoiceValue: invoiceAvg._avg.total || 0,
    tasksCompleted,
    projectsCompleted,
    hoursTracked: Math.round(((trackedTime._sum.duration || 0) / 60) * 10) / 10,
  })
}
