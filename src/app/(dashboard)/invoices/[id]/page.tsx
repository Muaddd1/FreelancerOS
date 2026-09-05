'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowLeft, Edit, Trash2, Printer, Download, FileText } from 'lucide-react'

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [invoice, setInvoice] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch(`/api/invoices/${params.id}`)
      .then(r => r.json())
      .then(d => { setInvoice(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm('Delete this invoice?')) return
    await fetch(`/api/invoices/${params.id}`, { method: 'DELETE' })
    toast.success('Invoice deleted')
    router.push('/invoices')
  }

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading...</div>
  if (!invoice) return <div className="p-6 text-sm text-muted-foreground">Invoice not found</div>

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-zinc-500',
    SENT: 'bg-blue-500',
    PAID: 'bg-green-500',
    OVERDUE: 'bg-red-500',
  }

  const subtotal = invoice.items?.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0) ?? 0
  const taxRate = invoice.taxRate || 0
  const taxAmount = subtotal * (taxRate / 100)
  const total = subtotal + taxAmount

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link href="/invoices">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">{invoice.number}</h1>
              <Badge className={statusColors[invoice.status] || 'bg-zinc-400'}>{invoice.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {invoice.client?.name ? (
                <Link href={`/clients/${invoice.client.id}`} className="hover:underline">{invoice.client.name}</Link>
              ) : 'No client'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-1.5" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1.5" />
            Download
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/invoices/${invoice.id}/edit`}>
              <Edit className="w-4 h-4 mr-1.5" />
              Edit
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-500 hover:text-red-600">
            <Trash2 className="w-4 h-4 mr-1.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Details */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Issue Date</span>
          <span>{formatDate(invoice.issueDate)}</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Due Date</span>
          <span>{formatDate(invoice.dueDate)}</span>
        </div>
        {invoice.project && (
          <>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Project</span>
              <Link href={`/projects/${invoice.project.id}`} className="hover:underline">{invoice.project.name}</Link>
            </div>
          </>
        )}
      </div>

      {/* Line Items */}
      <div>
        <h2 className="text-sm font-medium mb-3">Items</h2>
        <div className="border-b border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground">
                <th className="text-left py-2 font-normal">Description</th>
                <th className="text-right py-2 font-normal">Qty</th>
                <th className="text-right py-2 font-normal">Price</th>
                <th className="text-right py-2 font-normal">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item: any, idx: number) => (
                <tr key={idx} className="border-t border-border">
                  <td className="py-2.5">{item.description}</td>
                  <td className="py-2.5 text-right">{item.quantity}</td>
                  <td className="py-2.5 text-right">{formatCurrency(item.price)}</td>
                  <td className="py-2.5 text-right">{formatCurrency(item.quantity * item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {taxRate > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax ({taxRate}%)</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-medium border-t border-border pt-2">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div>
          <h2 className="text-sm font-medium mb-2">Notes</h2>
          <p className="text-sm text-muted-foreground">{invoice.notes}</p>
        </div>
      )}
    </div>
  )
}
