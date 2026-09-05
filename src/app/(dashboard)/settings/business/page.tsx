'use client'

import * as React from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { DashboardHeader } from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'

export default function BusinessSettingsPage() {
  const [loading, setLoading] = React.useState(false)
  const [form, setForm] = React.useState({ name: '', email: '', phone: '', address: '', taxRate: '', currency: 'USD', hourlyRate: '' })

  React.useEffect(() => {
    fetch('/api/business').then(r => r.ok ? r.json() : null).then(d => {
      if (d) setForm({ name: d.name || '', email: d.email || '', phone: d.phone || '', address: d.address || '', taxRate: d.taxRate || '', currency: d.currency || 'USD', hourlyRate: d.hourlyRate || '' })
    }).catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/business', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, taxRate: parseFloat(form.taxRate) || 0, hourlyRate: parseFloat(form.hourlyRate) || 0 }),
      })
      if (res.ok) toast.success('Business settings updated')
      else toast.error('Failed to update settings')
    } catch { toast.error('Failed to update settings') } finally { setLoading(false) }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <DashboardHeader title="Business Settings" description="Configure your business details" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-[#0F0F12] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Business Information</h2>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Business Name</Label>
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your Business Name" className="h-10" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Email</Label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="h-10" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Phone</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="h-10" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Address</Label>
            <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="123 Main St, City, Country" className="h-10" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0F0F12] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Invoice Settings</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Tax Rate (%)</Label>
              <Input type="number" step="0.01" value={form.taxRate} onChange={e => setForm({ ...form, taxRate: e.target.value })} className="h-10" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Currency</Label>
              <Select value={form.currency} onValueChange={v => setForm({ ...form, currency: v })}>
                <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                  <SelectItem value="AUD">AUD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Hourly Rate ($)</Label>
              <Input type="number" step="0.01" value={form.hourlyRate} onChange={e => setForm({ ...form, hourlyRate: e.target.value })} className="h-10" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="h-10 text-sm font-medium">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
