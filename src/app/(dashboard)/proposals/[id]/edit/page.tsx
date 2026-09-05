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
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface LineItem { description: string; quantity: number; price: number }

export default function EditProposalPage() {
  const router = useRouter()
  const params = useParams()
  const [clients, setClients] = React.useState<any[]>([])
  const [projects, setProjects] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [fetching, setFetching] = React.useState(true)
  const [form, setForm] = React.useState({ name: '', clientId: '', projectId: '', content: '', validUntil: '', status: 'DRAFT' })
  const [items, setItems] = React.useState<LineItem[]>([{ description: '', quantity: 1, price: 0 }])

  React.useEffect(() => {
    fetch('/api/clients').then(r => r.ok ? r.json() : []).then(setClients).catch(() => {})
    fetch('/api/projects').then(r => r.ok ? r.json() : []).then(setProjects).catch(() => {})
    fetch(`/api/proposals/${params.id}`).then(r => r.json()).then(d => {
      if (d.id) {
        setForm({ name: d.name || '', clientId: d.clientId || d.client?.id || '', projectId: d.projectId || '', content: d.content || '', validUntil: d.validUntil || '', status: d.status || 'DRAFT' })
        setItems(d.items?.length ? d.items : [{ description: '', quantity: 1, price: 0 }])
      }
      setFetching(false)
    }).catch(() => setFetching(false))
  }, [params.id])

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0)

  const handleItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item))
  }

  const addItem = () => setItems(prev => [...prev, { description: '', quantity: 1, price: 0 }])
  const removeItem = (index: number) => setItems(prev => prev.filter((_, i) => i !== index))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/proposals/${params.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items, subtotal, total: subtotal })
      })
      if (res.ok) { toast.success('Proposal updated'); router.push(`/proposals/${params.id}`) }
      else toast.error('Failed to update proposal')
    } catch { toast.error('Failed to update proposal') } finally { setLoading(false) }
  }

  if (fetching) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/proposals/${params.id}`}><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link>
        <DashboardHeader title="Edit Proposal" description="Update proposal details" />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Proposal Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Proposal Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Client</Label><Select value={form.clientId} onValueChange={v => setForm({ ...form, clientId: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Related Project</Label><Select value={form.projectId} onValueChange={v => setForm({ ...form, projectId: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Valid Until</Label><Input type="date" value={form.validUntil} onChange={e => setForm({ ...form, validUntil: e.target.value })} /></div>
                <div className="space-y-2"><Label>Status</Label><Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="DRAFT">Draft</SelectItem><SelectItem value="SENT">Sent</SelectItem><SelectItem value="ACCEPTED">Accepted</SelectItem><SelectItem value="REJECTED">Rejected</SelectItem></SelectContent></Select></div>
              </div>
              <div className="space-y-2"><Label>Content</Label><Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={5} /></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Line Items</CardTitle><Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="w-4 h-4 mr-2" />Add Item</Button></CardHeader>
            <CardContent className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1 space-y-1"><Label className="text-xs">Description</Label><Input value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} /></div>
                  <div className="w-24 space-y-1"><Label className="text-xs">Qty</Label><Input type="number" min="1" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)} /></div>
                  <div className="w-32 space-y-1"><Label className="text-xs">Price</Label><Input type="number" min="0" step="0.01" value={item.price} onChange={e => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)} /></div>
                  <div className="w-32 space-y-1"><Label className="text-xs">Total</Label><p className="h-10 flex items-center">{formatCurrency(item.quantity * item.price)}</p></div>
                  {items.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}><Trash2 className="w-4 h-4" /></Button>}
                </div>
              ))}
              <Separator className="my-4" />
              <div className="flex justify-end text-lg font-bold gap-8"><span>Total:</span><span>{formatCurrency(subtotal)}</span></div>
            </CardContent>
          </Card>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" asChild><Link href={`/proposals/${params.id}`}>Cancel</Link></Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </div>
      </form>
    </div>
  )
}
