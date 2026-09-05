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

const statusVariant: Record<string, 'secondary' | 'info' | 'success' | 'destructive'> = {
  DRAFT: 'secondary',
  SENT: 'info',
  ACCEPTED: 'success',
  REJECTED: 'destructive',
}

export default function ProposalsPage() {
  const [proposals, setProposals] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    fetch('/api/proposals')
      .then(r => r.json())
      .then(d => { setProposals(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = proposals.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.client?.name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader
        title="Proposals"
        description="Manage your proposals"
        action={
          <Button asChild size="sm">
            <Link href="/proposals/new">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Proposal
            </Link>
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search proposals..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 border-zinc-200 dark:border-zinc-800 h-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="w-8 h-8 text-muted-foreground mb-3" />
          <h3 className="text-sm font-semibold mb-1">No proposals yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first proposal to get started.
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href="/proposals/new">Add Proposal</Link>
          </Button>
        </div>
      ) : (
        <div className="stagger-children">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Sent Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(proposal => (
                <TableRow key={proposal.id}>
                  <TableCell>
                    <Link href={`/proposals/${proposal.id}`} className="font-medium hover:underline">
                      {proposal.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{proposal.client?.name || '—'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[proposal.status] ?? 'secondary'} className="text-xs">
                      {proposal.status?.charAt(0) + proposal.status?.slice(1).toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {proposal.total > 0 ? formatCurrency(proposal.total) : '—'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">
                      {proposal.sentAt ? formatDate(proposal.sentAt) : '—'}
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
