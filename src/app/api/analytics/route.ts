import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// last 6 calendar months, oldest first: [{ month: 'Apr', amount }, ...]
function monthBuckets(rows: { amount: number; date: Date }[], now: Date) {
  const months = Array.from({ length: 6 }, (_, i) => new Date(now.getFullYear(), now.getMonth() - 5 + i, 1))
  return months.map((m) => ({
    month: m.toLocaleString('en-US', { month: 'short' }),
    amount: rows
      .filter((r) => r.date.getFullYear() === m.getFullYear() && r.date.getMonth() === m.getMonth())
      .reduce((sum, r) => sum + r.amount, 0),
  }))
}

// % change of the current month vs the previous one; null when there is no baseline
function change(buckets: { amount: number }[]) {
  const [prev, cur] = buckets.slice(-2).map((b) => b.amount)
  return prev ? Math.round(((cur - prev) / Math.abs(prev)) * 100) : null
}

export async function GET() {
  const now = new Date()
  const since = new Date(now.getFullYear(), now.getMonth() - 5, 1)
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
    recentPayments,
    recentExpenses,
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
    prisma.payment.findMany({ where: { date: { gte: since } }, select: { amount: true, date: true } }),
    prisma.expense.findMany({ where: { date: { gte: since } }, select: { amount: true, date: true } }),
  ])

  const revenueByMonth = monthBuckets(recentPayments, now)
  const expensesByMonth = monthBuckets(recentExpenses, now)
  const profitByMonth = revenueByMonth.map((r, i) => ({ amount: r.amount - expensesByMonth[i].amount }))

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
    revenueByMonth,
    revenueChange: change(revenueByMonth),
    expensesChange: change(expensesByMonth),
    profitChange: change(profitByMonth),
  })
}
