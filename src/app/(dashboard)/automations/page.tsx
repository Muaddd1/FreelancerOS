'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { DashboardHeader } from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Plus, Zap, Edit, Trash2 } from 'lucide-react'
import type { Automation } from '@prisma/client'
import type { Jsonify } from '@/types/api'

export default function AutomationsPage() {
  const [automations, setAutomations] = React.useState<Jsonify<Automation>[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch('/api/automations').then(r => r.json()).then(d => { setAutomations(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const handleToggle = async (id: string, enabled: boolean) => {
    const res = await fetch(`/api/automations/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled }) })
    if (!res.ok) return toast.error('Failed to update automation')
    toast.success(enabled ? 'Automation enabled' : 'Automation disabled')
    setAutomations(automations.map(a => a.id === id ? { ...a, enabled } : a))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this automation?')) return
    const res = await fetch(`/api/automations/${id}`, { method: 'DELETE' })
    if (!res.ok) return toast.error('Failed to delete automation')
    toast.success('Automation deleted')
    setAutomations(automations.filter(a => a.id !== id))
  }

  if (loading) return <div className="text-sm text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Automations"
        description="Automate your workflows"
        action={
          <Button className="h-9 text-sm font-medium gap-1.5">
            <Plus className="w-4 h-4" /> New Automation
          </Button>
        }
      />
      {automations.length === 0 ? (
        <div className="text-center py-16">
          <Zap className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-sm font-semibold mb-1">No automations yet</h3>
          <p className="text-xs text-muted-foreground mb-4">Set up automations to streamline your workflow.</p>
          <Button className="h-9 text-sm font-medium gap-1.5">
            <Plus className="w-4 h-4" /> Create Automation
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {automations.map(auto => (
            <div key={auto.id} className="flex items-center justify-between px-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{auto.name}</p>
                  <p className="text-xs text-muted-foreground">Trigger: {auto.trigger} → Action: {auto.action}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={auto.enabled} onCheckedChange={checked => handleToggle(auto.id, checked)} />
                <Badge variant={auto.enabled ? 'default' : 'secondary'} className="text-xs">
                  {auto.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDelete(auto.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
