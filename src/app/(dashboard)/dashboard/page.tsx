'use client'

import * as React from 'react'
import Link from 'next/link'
import { DashboardHeader, HeaderSearch, NotificationBell } from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import {
  ArrowRight, Clock, CheckSquare, FileText, AlertCircle, AlertTriangle,
} from 'lucide-react'

const revenueData = [
  { month: 'Apr', amount: 4200 },
  { month: 'May', amount: 5800 },
  { month: 'Jun', amount: 4900 },
  { month: 'Jul', amount: 6300 },
  { month: 'Aug', amount: 7100 },
  { month: 'Sep', amount: 5400 },
]

const maxRevenue = Math.max(...revenueData.map((d) => d.amount))
const maxBarHeight = 120

const recentItems = [
  { label: 'Invoice #1042 paid', href: '/invoices', icon: CheckSquare, time: '2h ago' },
  { label: 'New client Acme Studio', href: '/clients', icon: AlertCircle, time: '5h ago' },
  { label: 'Project Website Redesign updated', href: '/projects', icon: FileText, time: '1d ago' },
  { label: 'Proposal sent to TechCorp', href: '/proposals', icon: AlertTriangle, time: '2d ago' },
]

const deadlines = [
  { label: 'Homepage Design', sub: 'Website Redesign Project', badge: 'Due in 3 days', variant: 'secondary' as const },
  { label: 'Invoice #1045', sub: 'Acme Corporation', badge: 'Overdue', variant: 'destructive' as const },
  { label: 'Proposal Review', sub: 'TechCorp Solutions', badge: 'Due in 7 days', variant: 'secondary' as const },
]

export default function DashboardPage() {
  const [stats, setStats] = React.useState<any>(null)

  React.useEffect(() => {
    fetch('/api/analytics')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <DashboardHeader
          title="Dashboard"
          description="Welcome back. Here's your business overview."
        />
        <div className="flex items-center gap-2">
          <HeaderSearch />
          <NotificationBell />
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-stretch">
        {[
          { label: 'Total Revenue', value: stats ? formatCurrency(stats.totalRevenue || 0) : '—' },
          { label: 'Active Projects', value: stats ? String(stats.activeProjects || 0) : '—' },
          { label: 'Total Clients', value: stats ? String(stats.totalClients || 0) : '—' },
          { label: 'Pending Invoices', value: stats ? String(stats.pendingInvoices || 0) : '—' },
        ].map((stat, i) => (
          <React.Fragment key={stat.label}>
            {i > 0 && <div className="w-px bg-zinc-200 dark:bg-zinc-800" />}
            <div className="flex-1 px-6 py-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</p>
              <p className="text-2xl font-semibold mt-1">{stat.value}</p>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
            <h2 className="text-sm font-medium">Revenue Overview</h2>
          </div>
          <div className="flex items-end gap-3 h-32">
            {revenueData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-xs text-muted-foreground font-medium">
                  {formatCurrency(d.amount, 'USD').replace('.00', '')}
                </span>
                <div
                  className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-sm transition-all"
                  style={{ height: `${(d.amount / maxRevenue) * maxBarHeight}px` }}
                />
                <span className="text-xs text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
            <h2 className="text-sm font-medium">Quick Stats</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Profit</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                {stats ? formatCurrency(stats.profit || 0) : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Expenses</span>
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                {stats ? formatCurrency(stats.totalExpenses || 0) : '—'}
              </span>
            </div>
            <div className="pt-2">
              <Link href="/analytics" className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:underline">
                View Analytics <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity + Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div>
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
            <h2 className="text-sm font-medium">Recent Activity</h2>
          </div>
          <div className="space-y-0">
            {recentItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                <span className="text-muted-foreground">
                  <item.icon className="w-4 h-4" />
                </span>
                <Link href={item.href} className="flex-1 text-sm hover:text-zinc-900 dark:hover:text-zinc-100">
                  {item.label}
                </Link>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div>
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
            <h2 className="text-sm font-medium">Upcoming Deadlines</h2>
          </div>
          <div className="space-y-0">
            {deadlines.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                <span className="text-muted-foreground">
                  <Clock className="w-4 h-4" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  item.variant === 'destructive'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-zinc-100 text-zinc-600 dark:bg-[#18181C] dark:text-zinc-400'
                }`}>
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
