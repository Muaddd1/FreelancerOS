'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function EditClientPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    address: '',
    status: 'ACTIVE',
  })

  React.useEffect(() => {
    fetch(`/api/clients/${params.id}`)
      .then(r => r.json())
      .then(d => {
        if (d && !d.error) {
          setForm({
            name: d.name || '',
            email: d.email || '',
            phone: d.phone || '',
            company: d.company || '',
            website: d.website || '',
            address: d.address || '',
            status: d.status || 'ACTIVE',
          })
        }
      })
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name) { toast.error('Name is required'); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/clients/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Client updated')
        router.push(`/clients/${params.id}`)
      } else {
        toast.error('Failed to update client')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href={`/clients/${params.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <DashboardHeader title="Edit Client" description="Update client information" />
        </div>
        <Button variant="outline" asChild className="h-9">
          <Link href={`/clients/${params.id}`}>Cancel</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-6 mb-6">
          <h2 className="text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wide mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Name *</Label>
              <Input
                className="h-10 border-zinc-200 dark:border-zinc-800"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Email</Label>
              <Input
                type="email"
                className="h-10 border-zinc-200 dark:border-zinc-800"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Phone</Label>
              <Input
                className="h-10 border-zinc-200 dark:border-zinc-800"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Company</Label>
              <Input
                className="h-10 border-zinc-200 dark:border-zinc-800"
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Website</Label>
              <Input
                className="h-10 border-zinc-200 dark:border-zinc-800"
                value={form.website}
                onChange={e => setForm({ ...form, website: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Status</Label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                <SelectTrigger className="h-10 border-zinc-200 dark:border-zinc-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-6 mb-6">
          <h2 className="text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wide mb-4">Address</h2>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Address</Label>
            <Input
              className="h-10 border-zinc-200 dark:border-zinc-800"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
