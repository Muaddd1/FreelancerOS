'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowLeft, Edit, Trash2, Mail, Phone, Globe, Building2 } from 'lucide-react'

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [lead, setLead] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch(`/api/leads/${params.id}`)
      .then(r => r.json())
      .then(d => { setLead(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm('Delete this lead?')) return
    await fetch(`/api/leads/${params.id}`, { method: 'DELETE' })
    toast.success('Lead deleted')
    router.push('/leads')
  }

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading...</div>
  if (!lead) return <div className="p-6 text-sm text-muted-foreground">Lead not found</div>

  const statusColors: Record<string, string> = {
    NEW: 'bg-blue-500',
    CONTACTED: 'bg-purple-500',
    QUALIFIED: 'bg-green-500',
    NEGOTIATION: 'bg-orange-500',
    WON: 'bg-green-600',
    LOST: 'bg-red-500',
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link href="/leads">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">{lead.name}</h1>
              <Badge className={statusColors[lead.status] || 'bg-zinc-400'}>{lead.status}</Badge>
            </div>
            {lead.company && (
              <p className="text-sm text-muted-foreground">{lead.company}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/leads/${lead.id}/edit`}>
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

      {/* Contact Info */}
      <div className="flex items-center gap-6 text-sm">
        {lead.email && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>{lead.email}</span>
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span>{lead.phone}</span>
          </div>
        )}
        {lead.website && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Globe className="w-4 h-4" />
            <span>{lead.website}</span>
          </div>
        )}
        {lead.company && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Building2 className="w-4 h-4" />
            <span>{lead.company}</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Value</span>
          <span className="font-medium">{formatCurrency(lead.value || 0)}</span>
        </div>
        {lead.source && (
          <>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Source</span>
              <span>{lead.source}</span>
            </div>
          </>
        )}
      </div>

      {/* Notes */}
      {lead.notes && (
        <div>
          <h2 className="text-sm font-medium mb-2">Notes</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{lead.notes}</p>
        </div>
      )}
    </div>
  )
}
