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
import { Plus, Search, FileText, Edit, Trash2, Eye } from 'lucide-react'

export default function ContractsPage() {
  const [contracts, setContracts] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    fetch('/api/contracts').then(r => r.json()).then(d => { setContracts(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const filtered = contracts.filter(c => c.title?.toLowerCase().includes(search.toLowerCase()) || c.client?.name?.toLowerCase().includes(search.toLowerCase()))

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      draft: { label: 'Draft', className: 'bg-zinc-100 text-zinc-600 dark:bg-[#18181C] dark:text-zinc-400' },
      active: { label: 'Active', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
      completed: { label: 'Completed', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
      terminated: { label: 'Terminated', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    }
    const s = map[status?.toLowerCase()] || map.draft
    return <Badge className={s.className}>{s.label}</Badge>
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this contract?')) return
    await fetch(`/api/contracts/${id}`, { method: 'DELETE' })
    toast.success('Contract deleted')
    setContracts(contracts.filter(c => c.id !== id))
  }

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader
        title="Contracts"
        description="Manage your client contracts"
        action={<Button asChild><Link href="/contracts/new"><Plus className="w-4 h-4 mr-2" />Add Contract</Link></Button>}
      />
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search contracts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      {filtered.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <h3 className="text-lg font-semibold mb-2">No contracts yet</h3>
          <p className="text-muted-foreground mb-4">Create your first contract to get started.</p>
          <Button asChild><Link href="/contracts/new"><Plus className="w-4 h-4 mr-2" />Create Contract</Link></Button>
        </Card>
      ) : (
        <Card>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtered.map(c => (
              <div key={c.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-2 bg-primary/10 rounded shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{c.title}</p>
                    <p className="text-sm text-muted-foreground">{c.client?.name || 'No client'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="font-medium">{formatCurrency(c.value || 0)}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.startDate ? `Started ${formatDate(c.startDate)}` : 'No start date'}
                    </p>
                  </div>
                  {getStatusBadge(c.status)}
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" asChild><Link href={`/contracts/${c.id}`}><Eye className="w-4 h-4" /></Link></Button>
                    <Button variant="ghost" size="icon" asChild><Link href={`/contracts/${c.id}/edit`}><Edit className="w-4 h-4" /></Link></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
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
