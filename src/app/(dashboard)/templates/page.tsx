'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { DashboardHeader } from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, Edit, Trash2, Eye } from 'lucide-react'

export default function TemplatesPage() {
  const [templates, setTemplates] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch('/api/templates').then(r => r.json()).then(d => { setTemplates(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this template?')) return
    await fetch(`/api/templates/${id}`, { method: 'DELETE' })
    toast.success('Template deleted')
    setTemplates(templates.filter(t => t.id !== id))
  }

  const typeColors: Record<string, string> = {
    PROPOSAL: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    CONTRACT: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    INVOICE: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  }

  if (loading) return <div className="text-sm text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Templates"
        description="Manage your templates"
        action={
          <Button className="h-9 text-sm font-medium gap-1.5">
            <Plus className="w-4 h-4" /> New Template
          </Button>
        }
      />
      {templates.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-sm font-semibold mb-1">No templates yet</h3>
          <p className="text-xs text-muted-foreground mb-4">Create templates for proposals, contracts, and invoices.</p>
          <Button className="h-9 text-sm font-medium gap-1.5">
            <Plus className="w-4 h-4" /> Create Template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(template => (
            <div key={template.id} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-150">
              <div className="flex items-start justify-between mb-3">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <Badge className={`text-xs border ${typeColors[template.type] || 'bg-zinc-100 dark:bg-[#18181C] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-[#232328]'}`}>
                  {template.type}
                </Badge>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{template.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{template.description || 'No description'}</p>
              <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                  <Eye className="w-3 h-3" /> Preview
                </Button>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDelete(template.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
