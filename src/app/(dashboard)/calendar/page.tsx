'use client'

import * as React from 'react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [tasks, setTasks] = React.useState<any[]>([])

  React.useEffect(() => {
    fetch('/api/tasks').then(r => r.json()).then(d => setTasks(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const getTasksForDay = (day: number) => tasks.filter(t => {
    if (!t.dueDate) return false
    const due = new Date(t.dueDate)
    return due.getDate() === day && due.getMonth() === month && due.getFullYear() === year
  })

  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)
  while (days.length % 7 !== 0) days.push(null)

  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  const statusColors: Record<string, string> = {
    TODO: 'bg-zinc-500',
    IN_PROGRESS: 'bg-blue-500',
    COMPLETED: 'bg-emerald-500',
  }

  return (
    <div className="space-y-6">
      <DashboardHeader title="Calendar" description="View tasks and deadlines" />

      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" className="h-9 w-9" onClick={prevMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
          {monthName}
        </h2>
        <Button variant="outline" size="icon" className="h-9 w-9" onClick={nextMonth}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
            <div key={d} className="py-2 text-center text-2xs font-medium text-muted-foreground uppercase tracking-wider">{d}</div>
          ))}
        </div>
        {/* Days */}
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const dayTasks = day ? getTasksForDay(day) : []
            return (
              <div
                key={i}
                className={`min-h-[72px] p-1.5 border-b border-r border-zinc-100 dark:border-zinc-800 ${!day ? 'bg-zinc-50/50 dark:bg-[#0A0A0D]/50' : ''} ${isToday(day!) ? 'bg-zinc-100/50 dark:bg-zinc-800/50' : ''}`}
              >
                {day && (
                  <>
                    <p className={`text-xs font-medium ${isToday(day) ? 'text-foreground' : 'text-muted-foreground'}`}>{day}</p>
                    <div className="space-y-0.5 mt-0.5">
                      {dayTasks.slice(0, 2).map(task => (
                        <Link key={task.id} href={`/tasks/${task.id}`}>
                          <div className={`text-2xs px-1 py-0.5 rounded truncate text-white ${statusColors[task.status] || 'bg-zinc-500'}`}>
                            {task.name}
                          </div>
                        </Link>
                      ))}
                      {dayTasks.length > 2 && <p className="text-2xs text-muted-foreground px-1">+{dayTasks.length - 2}</p>}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Upcoming Tasks</h3>
        {tasks.filter(t => t.dueDate && new Date(t.dueDate) >= new Date()).slice(0, 5).length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No upcoming tasks</p>
        ) : (
          <div className="space-y-2">
            {tasks.filter(t => t.dueDate && new Date(t.dueDate) >= new Date()).slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-[#0A0A0D] rounded-lg">
                <div>
                  <Link href={`/tasks/${task.id}`} className="text-sm font-medium text-foreground hover:underline">{task.name}</Link>
                  <p className="text-xs text-muted-foreground">{task.project?.name || 'No project'}</p>
                </div>
                <Badge className={`text-2xs text-white ${statusColors[task.status] || 'bg-zinc-500'}`}>
                  {task.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
