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

const statusVariant: Record<string, 'info' | 'warning' | 'success' | 'destructive'> = {
  NEW: 'info',
  CONTACTED: 'warning',
  QUALIFIED: 'success',
  LOST: 'destructive',
}

export default function LeadsPage() {
  const [leads, setLeads] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    fetch('/api/leads')
      .then(r => r.json())
      .then(d => { setLeads(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = leads.filter(l =>
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.company?.toLowerCase().includes(search.toLowerCase()) ||
    l.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader
        title="Leads"
        description="Manage your leads"
        action={
          <Button asChild size="sm">
            <Link href="/leads/new">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Lead
            </Link>
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search leads..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 border-zinc-200 dark:border-zinc-800 h-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="w-8 h-8 text-muted-foreground mb-3" />
          <h3 className="text-sm font-semibold mb-1">No leads yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first lead to get started.
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href="/leads/new">Add Lead</Link>
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
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(lead => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <Link href={`/leads/${lead.id}`} className="font-medium hover:underline">
                      {lead.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{lead.company || '—'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{lead.email}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[lead.status] ?? 'secondary'} className="text-xs">
                      {lead.status?.charAt(0) + lead.status?.slice(1).toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {lead.value != null ? formatCurrency(lead.value) : '—'}
                    </span>
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
