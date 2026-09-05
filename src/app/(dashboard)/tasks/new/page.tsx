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
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function NewTaskPage() {
  const router = useRouter()
  const [projects, setProjects] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [form, setForm] = React.useState({
    title: '',
    description: '',
    projectId: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '',
  })

  React.useEffect(() => {
    fetch('/api/projects')
      .then(r => r.ok ? r.json() : [])
      .then(setProjects)
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) { toast.error('Title is required'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Task created')
        router.push('/tasks')
      } else {
        toast.error('Failed to create task')
      }
    } catch {
      toast.error('Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/tasks">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <DashboardHeader title="New Task" description="Create a new task" />
        </div>
        <Button variant="outline" asChild className="h-9">
          <Link href="/tasks">Cancel</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-6 mb-6">
          <h2 className="text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wide mb-4">Task Details</h2>
          <div className="space-y-1.5 mb-4">
            <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Title *</Label>
            <Input
              className="h-10 border-zinc-200 dark:border-zinc-800"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Task title"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Project</Label>
              <Select value={form.projectId} onValueChange={v => setForm({ ...form, projectId: v })}>
                <SelectTrigger className="h-10 border-zinc-200 dark:border-zinc-800">
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
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Status</Label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                <SelectTrigger className="h-10 border-zinc-200 dark:border-zinc-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">Todo</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Priority</Label>
              <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                <SelectTrigger className="h-10 border-zinc-200 dark:border-zinc-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Due Date</Label>
              <Input
                type="date"
                className="h-10 border-zinc-200 dark:border-zinc-800"
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
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
              placeholder="Task description..."
              className="border-zinc-200 dark:border-zinc-800"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </form>
    </div>
  )
}
