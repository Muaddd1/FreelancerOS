'use client'

import * as React from 'react'
import { DashboardHeader } from '@/components/dashboard'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { MessageSquare } from 'lucide-react'

export default function MessagesPage() {
  const [messages, setMessages] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch('/api/messages').then(r => r.json()).then(d => { setMessages(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-sm text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-6">
      <DashboardHeader title="Messages" description="View client messages" />
      {messages.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-sm font-semibold mb-1">No messages yet</h3>
          <p className="text-xs text-muted-foreground">Messages from clients will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`p-4 border rounded-xl ${msg.read ? 'border-zinc-200 dark:border-zinc-800' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0A0A0D]'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{msg.client?.name || 'Unknown Client'}</p>
                    <p className="text-xs text-muted-foreground">{msg.project?.name || ''}</p>
                    <p className="text-sm text-foreground mt-2">{msg.content}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {!msg.read && <Badge variant="default" className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">New</Badge>}
                  <span className="text-xs text-muted-foreground">{formatDate(msg.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
