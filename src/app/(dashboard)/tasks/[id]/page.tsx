'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatDuration } from '@/lib/utils'
import { ArrowLeft, Edit, Trash2, Clock, Calendar, User } from 'lucide-react'

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [task, setTask] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch(`/api/tasks/${params.id}`)
      .then(r => r.json())
      .then(d => { setTask(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return
    await fetch(`/api/tasks/${params.id}`, { method: 'DELETE' })
    toast.success('Task deleted')
    router.push('/tasks')
  }

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading...</div>
  if (!task) return <div className="p-6 text-sm text-muted-foreground">Task not found</div>

  const statusColors: Record<string, string> = {
    TODO: 'bg-zinc-500',
    IN_PROGRESS: 'bg-blue-500',
    COMPLETED: 'bg-green-500',
  }

  const priorityColors: Record<string, string> = {
    LOW: 'bg-zinc-400',
    MEDIUM: 'bg-blue-400',
    HIGH: 'bg-orange-500',
    URGENT: 'bg-red-500',
  }

  const totalTime = task.timeEntries?.reduce((sum: number, t: any) => sum + (t.duration || 0), 0) ?? 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link href="/tasks">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">{task.name}</h1>
              <Badge className={priorityColors[task.priority] || 'bg-zinc-400'}>{task.priority || 'MEDIUM'}</Badge>
              <Badge className={statusColors[task.status] || 'bg-zinc-400'}>{task.status}</Badge>
            </div>
            {task.project && (
              <p className="text-sm text-muted-foreground">
                <Link href={`/projects/${task.project.id}`} className="hover:underline">{task.project.name}</Link>
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/tasks/${task.id}/edit`}>
              <Edit className="w-4 h-4 mr-1.5" />
              Edit
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-500 hover:text-red-600">
            <Trash2 className="w-4 h-4 mr-1.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-muted-foreground">{task.description}</p>
      )}

      {/* Details */}
      <div className="flex items-center gap-6 text-sm">
        {task.dueDate && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Due</span>
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
        {task.assignee && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Assigned to</span>
            <span>{task.assignee}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Time logged</span>
          <span>{formatDuration(totalTime)}</span>
        </div>
      </div>

      {/* Time Entries */}
      <div>
        <h2 className="text-sm font-medium mb-3">Time Entries</h2>
        <div className="space-y-3">
          {task.timeEntries?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No time entries yet</p>
          ) : (
            task.timeEntries?.map((entry: any) => (
              <div key={entry.id} className="border-b border-border py-3 last:border-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{entry.description || 'No description'}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(entry.date)}</p>
                  </div>
                  <span className="text-sm font-medium">{entry.duration}m</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
