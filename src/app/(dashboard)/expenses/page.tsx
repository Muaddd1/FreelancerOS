'use client'

import * as React from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { DashboardHeader } from '@/components/dashboard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, Search, Receipt, Edit, Trash2 } from 'lucide-react'

export default function ExpensesPage() {
  const [expenses, setExpenses] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    fetch('/api/expenses').then(r => r.json()).then(d => { setExpenses(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const filtered = expenses.filter(e =>
    e.description?.toLowerCase().includes(search.toLowerCase()) ||
    e.category?.toLowerCase().includes(search.toLowerCase())
  )
  const totalExpenses = filtered.reduce((sum, e) => sum + (e.amount || 0), 0)

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
      approved: { label: 'Approved', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
      rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    }
    const s = map[status?.toLowerCase()] || { label: status || 'Pending', className: 'bg-zinc-100 text-zinc-600 dark:bg-[#18181C] dark:text-zinc-400' }
    return <Badge className={s.className}>{s.label}</Badge>
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return
    await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
    toast.success('Expense deleted')
    setExpenses(expenses.filter(e => e.id !== id))
  }

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader
        title="Expenses"
        description="Track your business expenses"
        action={<Button asChild><Link href="/expenses/new"><Plus className="w-4 h-4 mr-2" />Add Expense</Link></Button>}
      />
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-sm font-medium whitespace-nowrap">
          <span className="text-muted-foreground">Total: </span>
          <span className="text-red-600 dark:text-red-400">{formatCurrency(totalExpenses)}</span>
        </p>
      </div>
      {filtered.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <h3 className="text-lg font-semibold mb-2">No expenses yet</h3>
          <p className="text-muted-foreground mb-4">Track your first expense to get started.</p>
          <Button asChild><Link href="/expenses/new"><Plus className="w-4 h-4 mr-2" />Add Expense</Link></Button>
        </Card>
      ) : (
        <Card>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtered.map(expense => (
              <div key={expense.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-2 bg-primary/10 rounded shrink-0">
                    <Receipt className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{expense.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {expense.category}
                      {expense.project?.name ? ` · ${expense.project.name}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="font-medium">{formatCurrency(expense.amount)}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(expense.date)}</p>
                  </div>
                  {getStatusBadge(expense.status)}
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" asChild><Link href={`/expenses/${expense.id}/edit`}><Edit className="w-4 h-4" /></Link></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(expense.id)} className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
