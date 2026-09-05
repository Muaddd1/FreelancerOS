'use client'

import * as React from 'react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard/header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'
import { Plus, Search, FolderOpen } from 'lucide-react'

const statusVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info' | 'outline'> = {
  ACTIVE: 'success',
  COMPLETED: 'info',
  ON_HOLD: 'warning',
  CANCELLED: 'destructive',
}

const priorityVariant: Record<string, 'secondary' | 'warning' | 'destructive'> = {
  LOW: 'secondary',
  MEDIUM: 'warning',
  HIGH: 'destructive',
}

export default function ProjectsPage() {
  const [projects, setProjects] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(d => { setProjects(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = projects.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.client?.name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader
        title="Projects"
        description="Manage your projects"
        action={
          <Button asChild size="sm">
            <Link href="/projects/new">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Project
            </Link>
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 border-zinc-200 dark:border-zinc-800 h-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FolderOpen className="w-8 h-8 text-muted-foreground mb-3" />
          <h3 className="text-sm font-semibold mb-1">No projects yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first project to get started.
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href="/projects/new">Add Project</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {filtered.map(project => (
            <Card key={project.id} className="hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link href={`/projects/${project.id}`} className="font-semibold text-sm hover:underline truncate block">
                      {project.name}
                    </Link>
                    <p className="text-xs text-muted-foreground truncate">
                      {project.client?.name || 'No client'}
                    </p>
                  </div>
                  <Badge variant={statusVariant[project.status] ?? 'secondary'} className="flex-shrink-0">
                    {project.status?.replace('_', ' ') || 'ACTIVE'}
                  </Badge>
                </div>

                {project.progress !== undefined && (
                  <Progress value={project.progress} className="h-1" />
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{project.budget ? formatCurrency(project.budget) : 'No budget'}</span>
                  <span>{project._count?.tasks ?? 0} tasks</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <Badge variant={priorityVariant[project.priority] ?? 'secondary'} className="text-xs">
                    {project.priority || 'MEDIUM'}
                  </Badge>
                  <Button variant="ghost" size="icon" asChild className="h-7 w-7">
                    <Link href={`/projects/${project.id}/edit`}>
                      <span className="sr-only">Edit</span>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
