'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'

interface LineItem {
  description: string
  quantity: number
  price: number
}

export default function NewProposalPage() {
  const router = useRouter()
  const [clients, setClients] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [form, setForm] = React.useState({
    title: '',
    clientId: '',
    value: '',
    status: 'DRAFT',
    description: '',
    sentDate: '',
  })
  const [items, setItems] = React.useState<LineItem[]>([
    { description: '', quantity: 1, price: 0 },
  ])

  React.useEffect(() => {
    fetch('/api/clients')
      .then(r => r.ok ? r.json() : [])
      .then(setClients)
      .catch(() => {})
  }, [])

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0)

  const handleItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item))
  }

  const addItem = () => setItems(prev => [...prev, { description: '', quantity: 1, price: 0 }])
  const removeItem = (index: number) => setItems(prev => prev.filter((_, i) => i !== index))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) { toast.error('Title is required'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          value: parseFloat(form.value) || subtotal,
          items,
          subtotal,
          total: subtotal,
        }),
      })
      if (res.ok) {
        toast.success('Proposal created')
        router.push('/proposals')
      } else {
        toast.error('Failed to create proposal')
      }
    } catch {
      toast.error('Failed to create proposal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/proposals">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <DashboardHeader title="New Proposal" description="Create a new proposal" />
        </div>
        <Button variant="outline" asChild className="h-9">
          <Link href="/proposals">Cancel</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-6 mb-6">
          <h2 className="text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wide mb-4">Proposal Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Title *</Label>
              <Input
                className="h-10 border-zinc-200 dark:border-zinc-800"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Website Design Proposal"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Client</Label>
              <Select value={form.clientId} onValueChange={v => setForm({ ...form, clientId: v })}>
                <SelectTrigger className="h-10 border-zinc-200 dark:border-zinc-800">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Value ($)</Label>
              <Input
                type="number"
                className="h-10 border-zinc-200 dark:border-zinc-800"
                value={form.value}
                onChange={e => setForm({ ...form, value: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Status</Label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                <SelectTrigger className="h-10 border-zinc-200 dark:border-zinc-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="SENT">Sent</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Sent Date</Label>
              <Input
                type="date"
                className="h-10 border-zinc-200 dark:border-zinc-800"
                value={form.sentDate}
                onChange={e => setForm({ ...form, sentDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-6 mb-6">
          <h2 className="text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wide mb-4">Description</h2>
          <div className="space-y-1.5">
            <Textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={4}
              placeholder="Proposal description..."
              className="border-zinc-200 dark:border-zinc-800"
            />
          </div>
        </div>

        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">Line Items</h2>
            <Button type="button" variant="outline" size="sm" onClick={addItem} className="h-8">
              <Plus className="w-3 h-3 mr-1.5" />
              Add Item
            </Button>
          </div>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex gap-3 items-end">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Description</Label>
                  <Input
                    className="h-10 border-zinc-200 dark:border-zinc-800"
                    value={item.description}
                    onChange={e => handleItemChange(index, 'description', e.target.value)}
                    placeholder="Service..."
                  />
                </div>
                <div className="w-20 space-y-1">
                  <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Qty</Label>
                  <Input
                    type="number"
                    min="1"
                    className="h-10 border-zinc-200 dark:border-zinc-800"
                    value={item.quantity}
                    onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="w-28 space-y-1">
                  <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Price ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    className="h-10 border-zinc-200 dark:border-zinc-800"
                    value={item.price}
                    onChange={e => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="w-28 space-y-1">
                  <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Total</Label>
                  <p className="h-10 flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                    {formatCurrency(item.quantity * item.price)}
                  </p>
                </div>
                {items.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 flex-shrink-0"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-end text-base font-semibold gap-8">
            <span>Total:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Proposal'}
          </Button>
        </div>
      </form>
    </div>
  )
}
