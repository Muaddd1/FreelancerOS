'use client'

import * as React from 'react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { DollarSign, TrendingUp, TrendingDown, ArrowRight, Briefcase } from 'lucide-react'

const revenueData = [
  { month: 'Apr', amount: 4200 },
  { month: 'May', amount: 5800 },
  { month: 'Jun', amount: 4900 },
  { month: 'Jul', amount: 6300 },
  { month: 'Aug', amount: 7100 },
  { month: 'Sep', amount: 5400 },
]

const maxRevenue = Math.max(...revenueData.map(d => d.amount))
const maxBarHeight = 160

export default function AnalyticsPage() {
  const [stats, setStats] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(d => { setStats(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  const s = stats || {}

  const profit = (s.totalRevenue || 0) - (s.totalExpenses || 0)
  const profitChange = s.profitChange != null ? s.profitChange : null
  const revenueChange = s.revenueChange != null ? s.revenueChange : null
  const expensesChange = s.expensesChange != null ? s.expensesChange : null

  return (
    <div className="p-6 space-y-8">
      <DashboardHeader title="Analytics" description="Business insights and performance metrics" />

      {/* Stats Row */}
      <div className="flex items-stretch">
        {[
          {
            label: 'Revenue',
            value: formatCurrency(s.totalRevenue || 0),
            change: revenueChange,
            icon: DollarSign,
            iconColor: 'text-green-500',
          },
          {
            label: 'Expenses',
            value: formatCurrency(s.totalExpenses || 0),
            change: expensesChange,
            icon: DollarSign,
            iconColor: 'text-red-500',
          },
          {
            label: 'Profit',
            value: formatCurrency(profit),
            change: profitChange,
            icon: profit >= 0 ? TrendingUp : TrendingDown,
            iconColor: profit >= 0 ? 'text-green-500' : 'text-red-500',
          },
          {
            label: 'Active Projects',
            value: String(s.activeProjects || 0),
            change: null,
            icon: Briefcase,
            iconColor: 'text-blue-500',
          },
        ].map((stat, i) => (
          <React.Fragment key={stat.label}>
            {i > 0 && <div className="w-px bg-zinc-200 dark:bg-zinc-800" />}
            <div className="flex-1 px-6 py-3">
              <div className="flex items-center gap-2 mb-1">
                <span className={stat.iconColor}><stat.icon className="w-4 h-4" /></span>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</p>
              </div>
              <p className="text-2xl font-semibold">{stat.value}</p>
              {stat.change != null && (
                <p className={`text-xs mt-0.5 ${stat.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {stat.change >= 0 ? '+' : ''}{stat.change}% vs last month
                </p>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Revenue Chart */}
      <div>
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
          <h2 className="text-sm font-medium">Revenue Overview</h2>
        </div>
        <div className="flex items-end gap-3 h-44">
          {revenueData.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                {formatCurrency(d.amount, 'USD').replace('.00', '')}
              </span>
              <div
                className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-sm transition-all"
                style={{ height: `${Math.max(8, (d.amount / maxRevenue) * maxBarHeight)}px` }}
              />
              <span className="text-xs text-muted-foreground">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoices by Status */}
        <Card>
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4 px-6 pt-6">
            <h2 className="text-sm font-medium">Invoices by Status</h2>
          </div>
          <CardContent className="px-6 pb-6">
            <div className="space-y-3">
              {Object.entries(s.invoicesByStatus || {}).map(([status, count]) => {
                const total = Object.values(s.invoicesByStatus || {}).reduce((a: number, b: any) => a + (Number(b) || 0), 0)
                const pct = total > 0 ? ((Number(count) || 0) / total) * 100 : 0
                return (
                  <div key={status} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-20">{status}</span>
                    <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-[#18181C] rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm font-medium w-6 text-right">{String(count)}</span>
                  </div>
                )
              })}
              {Object.keys(s.invoicesByStatus || {}).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No invoice data</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4 px-6 pt-6">
            <h2 className="text-sm font-medium">Quick Stats</h2>
          </div>
          <CardContent className="px-6 pb-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg. Invoice Value</span>
              <span className="text-sm font-semibold">{formatCurrency(s.avgInvoiceValue || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Projects Completed</span>
              <span className="text-sm font-semibold">{s.projectsCompleted || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tasks Completed</span>
              <span className="text-sm font-semibold">{s.tasksCompleted || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Hours Tracked</span>
              <span className="text-sm font-semibold">{s.hoursTracked || 0}h</span>
            </div>
            <div className="pt-2">
              <Link href="/analytics" className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline">
                View full analytics <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
