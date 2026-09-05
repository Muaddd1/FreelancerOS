'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import { DashboardHeader } from '@/components/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'

export default function EditContractPage() {
  const router = useRouter()
  const params = useParams()
  const [clients, setClients] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [fetching, setFetching] = React.useState(true)
  const [form, setForm] = React.useState({ name: '', clientId: '', content: '', startDate: '', endDate: '', value: '', status: 'DRAFT' })

  React.useEffect(() => {
    fetch('/api/clients').then(r => r.ok ? r.json() : []).then(setClients).catch(() => {})
    fetch(`/api/contracts/${params.id}`).then(r => r.json()).then(d => {
      if (d.id) setForm({ name: d.name || '', clientId: d.clientId || d.client?.id || '', content: d.content || '', startDate: d.startDate || '', endDate: d.endDate || '', value: d.value?.toString() || '', status: d.status || 'DRAFT' })
      setFetching(false)
    }).catch(() => setFetching(false))
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/contracts/${params.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, value: parseFloat(form.value) || 0 })
      })
      if (res.ok) { toast.success('Contract updated'); router.push(`/contracts/${params.id}`) }
      else toast.error('Failed to update contract')
    } catch { toast.error('Failed to update contract') } finally { setLoading(false) }
  }

  if (fetching) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/contracts/${params.id}`}><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link>
        <DashboardHeader title="Edit Contract" description="Update contract details" />
      </div>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader><CardTitle>Contract Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Contract Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Client</Label><Select value={form.clientId} onValueChange={v => setForm({ ...form, clientId: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Value ($)</Label><Input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} /></div>
              <div className="space-y-2"><Label>Status</Label><Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="DRAFT">Draft</SelectItem><SelectItem value="SENT">Sent</SelectItem><SelectItem value="SIGNED">Signed</SelectItem><SelectItem value="EXPIRED">Expired</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></div>
              <div className="space-y-2"><Label>End Date</Label><Input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Content</Label><Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={6} /></div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" asChild><Link href={`/contracts/${params.id}`}>Cancel</Link></Button>
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
        </div>
      </form>
    </div>
  )
}
