'use client'

import * as React from 'react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard/header'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, Search, FileText } from 'lucide-react'

const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  PAID: 'success',
  PENDING: 'warning',
  OVERDUE: 'destructive',
  DRAFT: 'secondary',
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    fetch('/api/invoices')
      .then(r => r.json())
      .then(d => { setInvoices(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = invoices.filter(inv =>
    inv.number?.toLowerCase().includes(search.toLowerCase()) ||
    inv.client?.name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader
        title="Invoices"
        description="Manage your invoices"
        action={
          <Button asChild size="sm">
            <Link href="/invoices/new">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Invoice
            </Link>
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search invoices..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 border-zinc-200 dark:border-zinc-800 h-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="w-8 h-8 text-muted-foreground mb-3" />
          <h3 className="text-sm font-semibold mb-1">No invoices yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first invoice to get started.
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href="/invoices/new">Add Invoice</Link>
          </Button>
        </div>
      ) : (
        <div className="stagger-children">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(invoice => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <Link href={`/invoices/${invoice.id}`} className="font-medium hover:underline">
                      {invoice.number}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{invoice.client?.name || '—'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{formatCurrency(invoice.total)}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[invoice.status] ?? 'secondary'}>
                      {invoice.status?.charAt(0) + invoice.status?.slice(1).toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{formatDate(invoice.dueDate)}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
