'use client'

import * as React from 'react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard/header'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'
import { Plus, Search, ListTodo } from 'lucide-react'

const priorityVariant: Record<string, 'secondary' | 'warning' | 'destructive'> = {
  LOW: 'secondary',
  MEDIUM: 'warning',
  HIGH: 'destructive',
}

const statusVariant: Record<string, 'success' | 'warning' | 'secondary'> = {
  DONE: 'success',
  IN_PROGRESS: 'warning',
  TODO: 'secondary',
}

export default function TasksPage() {
  const [tasks, setTasks] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    fetch('/api/tasks')
      .then(r => r.json())
      .then(d => { setTasks(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = tasks.filter(t =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.project?.name?.toLowerCase().includes(search.toLowerCase())
  )

  const toggleTask = async (task: any) => {
    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE'
    await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t))
  }

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader
        title="Tasks"
        description="Manage your tasks"
        action={
          <Button asChild size="sm">
            <Link href="/tasks/new">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Task
            </Link>
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 border-zinc-200 dark:border-zinc-800 h-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ListTodo className="w-8 h-8 text-muted-foreground mb-3" />
          <h3 className="text-sm font-semibold mb-1">No tasks yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first task to get started.
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href="/tasks/new">Add Task</Link>
          </Button>
        </div>
      ) : (
        <div className="stagger-children">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10" />
                <TableHead>Task</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(task => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Checkbox
                      checked={task.status === 'DONE'}
                      onCheckedChange={() => toggleTask(task)}
                      className="translate-y-0.5"
                    />
                  </TableCell>
                  <TableCell>
                    <span className={task.status === 'DONE' ? 'line-through text-muted-foreground' : 'font-medium'}>
                      {task.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    {task.project ? (
                      <Link href={`/projects/${task.project.id}`} className="text-xs text-muted-foreground hover:underline">
                        {task.project.name}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground text-sm">
                      {task.dueDate ? formatDate(task.dueDate) : '—'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={priorityVariant[task.priority] ?? 'secondary'} className="text-xs">
                      {task.priority || 'MEDIUM'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[task.status] ?? 'secondary'} className="text-xs">
                      {task.status?.replace('_', ' ') || 'TODO'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
