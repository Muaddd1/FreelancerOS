'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { DashboardHeader } from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { DollarSign } from 'lucide-react'

export default function PaymentsPage() {
  const [payments, setPayments] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch('/api/payments').then(r => r.json()).then(d => { setPayments(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const totalPayments = payments.reduce((sum, p) => sum + (p.amount || 0), 0)

  if (loading) return <div className="text-sm text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-6">
      <DashboardHeader title="Payments" description="View all recorded payments" />
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Total Received: <span className="font-semibold text-foreground">{formatCurrency(totalPayments)}</span></p>
        <Badge variant="default" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">{payments.length} Payments</Badge>
      </div>
      {payments.length === 0 ? (
        <div className="text-center py-16">
          <DollarSign className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-sm font-semibold mb-1">No payments yet</h3>
          <p className="text-xs text-muted-foreground">Payments will appear here when recorded.</p>
        </div>
      ) : (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          {payments.map(payment => (
            <div key={payment.id} className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-[#0A0A0D] transition-colors">
              <div className="flex items-center gap-3">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{payment.invoice?.number || payment.invoiceId}</p>
                  <p className="text-xs text-muted-foreground">{payment.client?.name || 'No client'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(payment.amount)}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(payment.date)}</p>
                </div>
                <Badge variant="secondary" className="text-xs">{payment.method || 'N/A'}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
