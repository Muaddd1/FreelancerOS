'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowLeft, Edit, Trash2, Mail, Phone, Globe, Building2 } from 'lucide-react'

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [client, setClient] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch(`/api/clients/${params.id}`)
      .then(r => r.json())
      .then(d => { setClient(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm('Delete this client?')) return
    await fetch(`/api/clients/${params.id}`, { method: 'DELETE' })
    toast.success('Client deleted')
    router.push('/clients')
  }

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading...</div>
  if (!client) return <div className="p-6 text-sm text-muted-foreground">Client not found</div>

  const totalRevenue = client.invoices?.reduce((sum: number, inv: any) => sum + (inv.paid || 0), 0) ?? 0
  const totalInvoices = client.invoices?.length ?? 0
  const paidInvoices = client.invoices?.filter((inv: any) => inv.status === 'PAID').length ?? 0
  const pendingInvoices = client.invoices?.filter((inv: any) => inv.status !== 'PAID').length ?? 0

  const statusVariant = client.status === 'ACTIVE' ? 'success' : 'secondary'

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link href="/clients">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{client.name}</h1>
            <p className="text-sm text-muted-foreground">{client.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/clients/${client.id}/edit`}>
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

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Status</span>
          <Badge variant={statusVariant}>{client.status === 'ACTIVE' ? 'Active' : 'Inactive'}</Badge>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Revenue</span>
          <span className="font-medium">{formatCurrency(totalRevenue)}</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Projects</span>
          <span className="font-medium">{client._count?.projects ?? 0}</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Invoices</span>
          <span className="font-medium">{totalInvoices} ({paidInvoices} paid, {pendingInvoices} pending)</span>
        </div>
      </div>

      {/* Contact Info */}
      <div className="flex items-center gap-6 text-sm">
        {client.email && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span>{client.phone}</span>
          </div>
        )}
        {client.company && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Building2 className="w-4 h-4" />
            <span>{client.company}</span>
          </div>
        )}
        {client.website && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Globe className="w-4 h-4" />
            <span>{client.website}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <div className="pt-4 space-y-3">
            {client.projects?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No projects yet</p>
            ) : (
              client.projects?.map((project: any) => (
                <div key={project.id} className="border-b border-border py-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <Link href={`/projects/${project.id}`} className="font-medium hover:underline">
                        {project.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{project.tasks?.length ?? 0} tasks</p>
                    </div>
                    <Badge variant={project.status === 'ACTIVE' ? 'success' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="invoices">
          <div className="pt-4 space-y-3">
            {client.invoices?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No invoices yet</p>
            ) : (
              client.invoices?.map((invoice: any) => (
                <div key={invoice.id} className="border-b border-border py-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <Link href={`/invoices/${invoice.id}`} className="font-medium hover:underline">
                        {invoice.number}
                      </Link>
                      <p className="text-sm text-muted-foreground">Due: {formatDate(invoice.dueDate)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{formatCurrency(invoice.total || 0)}</span>
                      <Badge variant={invoice.status === 'PAID' ? 'success' : invoice.status === 'OVERDUE' ? 'destructive' : 'secondary'}>
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="proposals">
          <div className="pt-4 space-y-3">
            {client.proposals?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No proposals yet</p>
            ) : (
              client.proposals?.map((proposal: any) => (
                <div key={proposal.id} className="border-b border-border py-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <Link href={`/proposals/${proposal.id}`} className="font-medium hover:underline">
                        {proposal.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{formatCurrency(proposal.total || 0)}</p>
                    </div>
                    <Badge variant={proposal.status === 'ACCEPTED' ? 'success' : proposal.status === 'REJECTED' ? 'destructive' : 'secondary'}>
                      {proposal.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="contracts">
          <div className="pt-4 space-y-3">
            {client.contracts?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No contracts yet</p>
            ) : (
              client.contracts?.map((contract: any) => (
                <div key={contract.id} className="border-b border-border py-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <Link href={`/contracts/${contract.id}`} className="font-medium hover:underline">
                        {contract.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">{formatDate(contract.startDate)} - {formatDate(contract.endDate)}</p>
                    </div>
                    <Badge variant={contract.status === 'ACTIVE' ? 'success' : 'secondary'}>
                      {contract.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <div className="pt-4 space-y-3">
            {client.activities?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet</p>
            ) : (
              client.activities?.map((activity: any) => (
                <div key={activity.id} className="border-b border-border py-3 last:border-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(activity.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
