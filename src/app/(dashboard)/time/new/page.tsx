'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ProjectListItem } from '@/types/api'

// Manual entry for time worked away from the timer on /time. Duration is stored in minutes, like the timer.
export default function NewTimeEntryPage() {
  const router = useRouter()
  const [projects, setProjects] = React.useState<ProjectListItem[]>([])
  const [loading, setLoading] = React.useState(false)
  const [form, setForm] = React.useState({
    description: '',
    projectId: '',
    date: new Date().toISOString().slice(0, 10),
    start: '09:00',
    hours: '1',
    minutes: '0',
    billable: true,
  })

  React.useEffect(() => {
    fetch('/api/projects')
      .then(r => r.ok ? r.json() : [])
      .then(setProjects)
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const duration = (parseInt(form.hours) || 0) * 60 + (parseInt(form.minutes) || 0)
    if (duration <= 0) { toast.error('Duration must be more than 0 minutes'); return }
    const startTime = new Date(`${form.date}T${form.start}`)
    const endTime = new Date(startTime.getTime() + duration * 60000)
    setLoading(true)
    try {
      const res = await fetch('/api/time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: form.description,
          projectId: form.projectId,
          billable: form.billable,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          duration,
        }),
      })
      if (res.ok) {
        toast.success('Time logged')
        router.push('/time')
      } else {
        toast.error('Failed to log time')
      }
    } catch {
      toast.error('Failed to log time')
    } finally {
      setLoading(false)
    }
  }

  const label = 'text-xs font-medium text-zinc-700 dark:text-zinc-300'
  const input = 'h-10 border-zinc-200 dark:border-zinc-800'

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/time">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <DashboardHeader title="Log Time" description="Add time you worked without the timer" />
        </div>
        <Button variant="outline" asChild className="h-9">
          <Link href="/time">Cancel</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <Label className={label}>Description</Label>
            <Input className={input} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What did you work on?" />
          </div>
          <div className="space-y-1.5">
            <Label className={label}>Project</Label>
            <Select value={form.projectId} onValueChange={v => setForm({ ...form, projectId: v })}>
              <SelectTrigger className={input}>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className={label}>Date</Label>
            <Input type="date" className={input} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className={label}>Start time</Label>
            <Input type="time" className={input} value={form.start} onChange={e => setForm({ ...form, start: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className={label}>Duration</Label>
            <div className="flex items-center gap-2">
              <Input type="number" min="0" className={input} value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} aria-label="Hours" />
              <span className="text-sm text-muted-foreground">h</span>
              <Input type="number" min="0" max="59" className={input} value={form.minutes} onChange={e => setForm({ ...form, minutes: e.target.value })} aria-label="Minutes" />
              <span className="text-sm text-muted-foreground">m</span>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input type="checkbox" checked={form.billable} onChange={e => setForm({ ...form, billable: e.target.checked })} />
            Billable
          </label>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Log Time'}
          </Button>
        </div>
      </form>
    </div>
  )
}
