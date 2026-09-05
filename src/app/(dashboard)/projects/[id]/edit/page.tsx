'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface FormData {
  name: string
  clientId: string
  description: string
  status: string
  budget: string
  startDate: string
  endDate: string
}

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = React.useState(false)
  const [fetching, setFetching] = React.useState(true)
  const [clients, setClients] = React.useState<Array<{ id: string; name: string }>>([])
  const [form, setForm] = React.useState<FormData>({
    name: '',
    clientId: '',
    description: '',
    status: 'ACTIVE',
    budget: '',
    startDate: '',
    endDate: '',
  })

  React.useEffect(() => {
    fetch('/api/clients')
      .then(r => r.ok ? r.json() : [])
      .then(d => setClients(d))
      .catch(() => {})
    fetch(`/api/projects/${params.id}`)
      .then(r => r.json())
      .then(d => {
        if (d.id) {
          setForm({
            name: d.name || '',
            clientId: d.clientId || d.client?.id || '',
            description: d.description || '',
            status: d.status || 'ACTIVE',
            budget: d.budget?.toString() || '',
            startDate: d.startDate || '',
            endDate: d.endDate || '',
          })
        }
        setFetching(false)
      })
      .catch(() => setFetching(false))
  }, [params.id])

  const handleChange = (field: keyof FormData, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, budget: parseFloat(form.budget) || 0 }
      const res = await fetch(`/api/projects/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        toast.success('Project updated')
        router.push(`/projects/${params.id}`)
      } else {
        toast.error('Failed to update project')
      }
    } catch {
      toast.error('Failed to update project')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href={`/projects/${params.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <DashboardHeader title="Edit Project" description="Update project details" />
        </div>
        <Button variant="outline" asChild className="h-9">
          <Link href={`/projects/${params.id}`}>Cancel</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-6 mb-6">
          <h2 className="text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wide mb-4">Project Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Name *</Label>
              <Input
                className="h-10 border-zinc-200 dark:border-zinc-800"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Client</Label>
              <Select value={form.clientId} onValueChange={v => handleChange('clientId', v)}>
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
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Status</Label>
              <Select value={form.status} onValueChange={v => handleChange('status', v)}>
                <SelectTrigger className="h-10 border-zinc-200 dark:border-zinc-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="ON_HOLD">On Hold</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Budget</Label>
              <Input
                type="number"
                className="h-10 border-zinc-200 dark:border-zinc-800"
                value={form.budget}
                onChange={e => handleChange('budget', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Start Date</Label>
              <Input
                type="date"
                className="h-10 border-zinc-200 dark:border-zinc-800"
                value={form.startDate}
                onChange={e => handleChange('startDate', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">End Date</Label>
              <Input
                type="date"
                className="h-10 border-zinc-200 dark:border-zinc-800"
                value={form.endDate}
                onChange={e => handleChange('endDate', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-6 mb-6">
          <h2 className="text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wide mb-4">Description</h2>
          <div className="space-y-1.5">
            <Textarea
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              rows={4}
              className="border-zinc-200 dark:border-zinc-800"
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
