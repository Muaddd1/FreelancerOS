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

interface LineItem {
  description: string
  quantity: number
  price: number
}

export default function EditInvoicePage() {
  const router = useRouter()
  const params = useParams()
  const [clients, setClients] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [fetching, setFetching] = React.useState(true)
  const [form, setForm] = React.useState({
    number: '',
    clientId: '',
    issueDate: '',
    dueDate: '',
    status: 'DRAFT',
    notes: '',
  })
  const [items, setItems] = React.useState<LineItem[]>([
    { description: '', quantity: 1, price: 0 },
  ])
  const [taxRate, setTaxRate] = React.useState('0')

  React.useEffect(() => {
    fetch('/api/clients')
      .then((r) => (r.ok ? r.json() : []))
      .then(setClients)
      .catch(() => {})
    fetch(`/api/invoices/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.id) {
          setForm({
            number: d.number || '',
            clientId: d.clientId || d.client?.id || '',
            issueDate: d.issueDate || '',
            dueDate: d.dueDate || '',
            status: d.status || 'DRAFT',
            notes: d.notes || '',
          })
          setItems(d.items?.length ? d.items : [{ description: '', quantity: 1, price: 0 }])
        }
        setFetching(false)
      })
      .catch(() => setFetching(false))
  }, [params.id])

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const tax = (subtotal * (parseFloat(taxRate) || 0)) / 100
  const total = subtotal + tax

  const handleItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  const addItem = () =>
    setItems((prev) => [...prev, { description: '', quantity: 1, price: 0 }])
  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/invoices/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items, subtotal, tax, total }),
      })
      if (res.ok) {
        toast.success('Invoice updated')
        router.push(`/invoices/${params.id}`)
      } else {
        toast.error('Failed to update invoice')
      }
    } catch {
      toast.error('Failed to update invoice')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="p-6 text-muted-foreground">Loading...</div>
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/invoices/${params.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <DashboardHeader
          title="Edit Invoice"
          description="Update invoice details"
        />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Invoice Number</Label>
                  <Input
                    value={form.number}
                    onChange={(e) => setForm({ ...form, number: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Client *</Label>
                  <Select
                    value={form.clientId}
                    onValueChange={(v) => setForm({ ...form, clientId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Issue Date</Label>
                  <Input
                    type="date"
                    value={form.issueDate}
                    onChange={(e) =>
                      setForm({ ...form, issueDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm({ ...form, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="SENT">Sent</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="OVERDUE">Overdue</SelectItem>
                      <SelectItem value="VOID">Void</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Line Items</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, 'description', e.target.value)
                      }
                    />
                  </div>
                  <div className="w-24 space-y-1">
                    <Label className="text-xs">Qty</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          'quantity',
                          parseInt(e.target.value) || 1
                        )
                      }
                    />
                  </div>
                  <div className="w-32 space-y-1">
                    <Label className="text-xs">Price</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          'price',
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="w-32 space-y-1">
                    <Label className="text-xs">Total</Label>
                    <p className="h-10 flex items-center">
                      {formatCurrency(item.quantity * item.price)}
                    </p>
                  </div>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Separator className="my-4" />
              <div className="flex flex-col items-end gap-2 text-sm">
                <div className="flex gap-8">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex gap-8">
                  <span className="text-muted-foreground">
                    Tax ({taxRate}%):
                  </span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex gap-8 text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
              />
            </CardContent>
          </Card>
          <div className="flex justify-end gap-3 p-6 pt-0">
            <Button type="button" variant="outline" asChild>
              <Link href={`/invoices/${params.id}`}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
