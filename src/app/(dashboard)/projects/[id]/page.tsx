'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowLeft, Edit, Trash2, DollarSign, Users, Clock, FileText } from 'lucide-react'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch(`/api/projects/${params.id}`)
      .then(r => r.json())
      .then(d => { setProject(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm('Delete this project?')) return
    await fetch(`/api/projects/${params.id}`, { method: 'DELETE' })
    toast.success('Project deleted')
    router.push('/projects')
  }

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading...</div>
  if (!project) return <div className="p-6 text-sm text-muted-foreground">Project not found</div>

  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-green-500',
    COMPLETED: 'bg-blue-500',
    ON_HOLD: 'bg-yellow-500',
    CANCELLED: 'bg-red-500',
  }

  const priorityColors: Record<string, string> = {
    LOW: 'bg-zinc-400',
    MEDIUM: 'bg-blue-400',
    HIGH: 'bg-orange-500',
    URGENT: 'bg-red-500',
  }

  const totalTime = project.timeEntries?.reduce((sum: number, t: any) => sum + (t.duration || 0), 0) ?? 0
  const totalBudget = project.budget || 0
  const totalExpenses = project.expenses?.reduce((sum: number, e: any) => sum + (e.amount || 0), 0) ?? 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link href="/projects">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">{project.name}</h1>
              <Badge className={statusColors[project.status] || 'bg-zinc-400'}>{project.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {project.client?.name ? (
                <Link href={`/clients/${project.client.id}`} className="hover:underline">{project.client.name}</Link>
              ) : 'No client'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/projects/${project.id}/edit`}>
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
      {project.description && (
        <p className="text-sm text-muted-foreground">{project.description}</p>
      )}

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Budget</span>
          <span className="font-medium">{formatCurrency(totalBudget)}</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Expenses</span>
          <span className="font-medium">{formatCurrency(totalExpenses)}</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Time</span>
          <span className="font-medium">{Math.round(totalTime / 60)}h {totalTime % 60}m</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Priority</span>
          <Badge className={priorityColors[project.priority] || 'bg-zinc-400'}>{project.priority || 'MEDIUM'}</Badge>
        </div>
      </div>

      {/* Progress */}
      {project.progress !== undefined && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} />
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="time">Time Entries</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <div className="pt-4 space-y-3">
            {project.tasks?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks yet</p>
            ) : (
              project.tasks?.map((task: any) => (
                <div key={task.id} className="border-b border-border py-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <Link href={`/tasks/${task.id}`} className="font-medium hover:underline">
                        {task.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {task.timeEntries?.reduce((sum: number, t: any) => sum + (t.duration || 0), 0) ?? 0}m logged
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={task.status === 'COMPLETED' ? 'success' : 'secondary'}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="time">
          <div className="pt-4 space-y-3">
            {project.timeEntries?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No time entries yet</p>
            ) : (
              project.timeEntries?.map((entry: any) => (
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
        </TabsContent>

        <TabsContent value="files">
          <div className="pt-4 space-y-3">
            {project.files?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No files yet</p>
            ) : (
              project.files?.map((file: any) => (
                <div key={file.id} className="border-b border-border py-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(file.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
