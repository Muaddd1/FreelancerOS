'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowLeft, Edit, Trash2, ChevronRight } from 'lucide-react'

export default function ProposalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [proposal, setProposal] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch(`/api/proposals/${params.id}`)
      .then(r => r.json())
      .then(d => { setProposal(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm('Delete this proposal?')) return
    await fetch(`/api/proposals/${params.id}`, { method: 'DELETE' })
    toast.success('Proposal deleted')
    router.push('/proposals')
  }

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading...</div>
  if (!proposal) return <div className="p-6 text-sm text-muted-foreground">Proposal not found</div>

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-zinc-500',
    SENT: 'bg-blue-500',
    VIEWED: 'bg-purple-500',
    ACCEPTED: 'bg-green-500',
    REJECTED: 'bg-red-500',
    EXPIRED: 'bg-orange-500',
  }

  const statusOrder = ['DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'REJECTED']
  const currentStatusIndex = statusOrder.indexOf(proposal.status)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link href="/proposals">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">{proposal.name}</h1>
              <Badge className={statusColors[proposal.status] || 'bg-zinc-400'}>{proposal.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {proposal.client?.name ? (
                <Link href={`/clients/${proposal.client.id}`} className="hover:underline">{proposal.client.name}</Link>
              ) : 'No client'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/proposals/${proposal.id}/edit`}>
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

      {/* Value */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Value</span>
        <span className="text-lg font-semibold">{formatCurrency(proposal.total || 0)}</span>
      </div>

      {/* Status Flow */}
      <div>
        <h2 className="text-sm font-medium mb-3">Status</h2>
        <div className="flex items-center gap-2">
          {['DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'REJECTED'].map((status, idx) => {
            const isActive = idx <= currentStatusIndex && (proposal.status !== 'REJECTED' || status !== 'ACCEPTED')
            const isCurrent = status === proposal.status
            return (
              <React.Fragment key={status}>
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    isCurrent ? 'bg-zinc-900 text-white dark:bg-[#0F0F12] dark:text-white' :
                    isActive ? 'bg-green-500 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-muted-foreground'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className={`text-xs ${isCurrent ? 'font-medium' : 'text-muted-foreground'}`}>{status}</span>
                </div>
                {idx < 4 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Valid Until */}
      {proposal.validUntil && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Valid Until</span>
          <span>{formatDate(proposal.validUntil)}</span>
        </div>
      )}

      {/* Description */}
      {proposal.description && (
        <div>
          <h2 className="text-sm font-medium mb-2">Description</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{proposal.description}</p>
        </div>
      )}

      {/* Items */}
      {proposal.items?.length > 0 && (
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
                {proposal.items?.map((item: any, idx: number) => (
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
      )}
    </div>
  )
}
