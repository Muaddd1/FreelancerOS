'use client'

import * as React from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { DashboardHeader } from '@/components/dashboard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDuration } from '@/lib/utils'
import { Play, Square, Clock, Plus } from 'lucide-react'

export default function TimePage() {
  const [entries, setEntries] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [timerActive, setTimerActive] = React.useState(false)
  const [timerStart, setTimerStart] = React.useState<Date | null>(null)
  const [elapsed, setElapsed] = React.useState(0)
  const [form, setForm] = React.useState({ description: '', projectId: '', taskId: '' })
  const [projects, setProjects] = React.useState<any[]>([])

  React.useEffect(() => {
    fetch('/api/time-entries').then(r => r.json()).then(d => { setEntries(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
    fetch('/api/projects').then(r => r.ok ? r.json() : []).then(setProjects).catch(() => {})
  }, [])

  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerActive && timerStart) {
      interval = setInterval(() => setElapsed(Math.floor((Date.now() - timerStart.getTime()) / 1000)), 1000)
    }
    return () => clearInterval(interval)
  }, [timerActive, timerStart])

  const handleStartTimer = () => {
    if (!form.description.trim()) {
      toast.error('Please enter a description')
      return
    }
    setTimerActive(true)
    setTimerStart(new Date())
  }

  const handleStopTimer = async () => {
    if (!timerStart) return
    setTimerActive(false)
    const duration = Math.floor((Date.now() - timerStart.getTime()) / 1000)
    const date = new Date().toISOString()
    try {
      const res = await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, duration, date }),
      })
      if (res.ok) {
        const newEntry = await res.json()
        toast.success('Time entry recorded')
        setEntries([newEntry, ...entries])
      } else {
        toast.error('Failed to record time')
      }
    } catch {
      toast.error('Failed to record time')
    }
    setTimerStart(null)
    setElapsed(0)
    setForm({ description: '', projectId: '', taskId: '' })
  }

  const formatElapsed = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  const groupedEntries = entries.reduce((acc: Record<string, any[]>, entry) => {
    const date = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    if (!acc[date]) acc[date] = []
    acc[date].push(entry)
    return acc
  }, {})

  const totalToday = entries
    .filter(e => new Date(e.date).toDateString() === new Date().toDateString())
    .reduce((sum, e) => sum + (e.duration || 0), 0)

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader
        title="Time Tracking"
        description="Track time spent on tasks and projects"
        action={<Button asChild><Link href="/time/new"><Plus className="w-4 h-4 mr-2" />Log Time</Link></Button>}
      />

      {/* Timer Card */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-6xl font-mono font-bold tracking-tight mb-6">
              {formatElapsed(elapsed)}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
              <div className="flex-1">
                <Input
                  placeholder="What are you working on?"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  disabled={timerActive}
                />
              </div>
              <Select value={form.projectId} onValueChange={v => setForm(f => ({ ...f, projectId: v }))} disabled={timerActive}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center gap-4">
              {timerActive ? (
                <Button size="lg" variant="destructive" onClick={handleStopTimer}>
                  <Square className="w-4 h-4 mr-2" />Stop
                </Button>
              ) : (
                <Button size="lg" onClick={handleStartTimer}>
                  <Play className="w-4 h-4 mr-2" />Start Timer
                </Button>
              )}
            </div>

            {totalToday > 0 && (
              <p className="text-sm text-muted-foreground mt-4">
                Total today: <span className="font-medium">{formatDuration(totalToday)}</span>
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Time Entries */}
      <div>
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
          <h2 className="text-sm font-medium">Time Entries</h2>
        </div>

        {entries.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <h3 className="text-lg font-semibold mb-2">No time entries yet</h3>
            <p className="text-muted-foreground mb-4">Start the timer above or log time manually.</p>
            <Button asChild><Link href="/time/new"><Plus className="w-4 h-4 mr-2" />Log Time</Link></Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedEntries).map(([date, dateEntries]) => {
              const dayTotal = (dateEntries as any[]).reduce((s, e) => s + (e.duration || 0), 0)
              return (
                <div key={date}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">{date}</h3>
                    <span className="text-xs font-medium text-muted-foreground">{formatDuration(dayTotal)}</span>
                  </div>
                  <div className="space-y-1">
                    {dateEntries.map((entry: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{entry.description || entry.task || 'No description'}</p>
                            <p className="text-xs text-muted-foreground truncate">{entry.project?.name || 'No project'}</p>
                          </div>
                        </div>
                        <span className="font-mono text-sm font-medium shrink-0 ml-4">{formatDuration(entry.duration)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
