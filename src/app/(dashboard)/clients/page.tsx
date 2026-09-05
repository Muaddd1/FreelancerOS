'use client'

import * as React from 'react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard/header'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'
import { Plus, Search, Users } from 'lucide-react'

export default function ClientsPage() {
  const [clients, setClients] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    fetch('/api/clients')
      .then(r => r.json())
      .then(d => { setClients(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = clients.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader
        title="Clients"
        description="Manage your clients"
        action={
          <Button asChild size="sm">
            <Link href="/clients/new">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Client
            </Link>
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 border-zinc-200 dark:border-zinc-800 h-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="w-8 h-8 text-muted-foreground mb-3" />
          <h3 className="text-sm font-semibold mb-1">No clients yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first client to get started.
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href="/clients/new">Add Client</Link>
          </Button>
        </div>
      ) : (
        <div className="stagger-children">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(client => {
                const totalRevenue = client.invoices?.reduce((sum: number, inv: any) => sum + (inv.paid || 0), 0) ?? 0
                return (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div>
                        <Link href={`/clients/${client.id}`} className="font-semibold hover:underline">
                          {client.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">{client.company || '—'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">{client.email}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">{client._count?.projects ?? 0}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{formatCurrency(totalRevenue)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={client.status === 'ACTIVE' ? 'success' : 'secondary'}>
                        {client.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                        <Link href={`/clients/${client.id}/edit`}>
                          <span className="sr-only">Edit</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
