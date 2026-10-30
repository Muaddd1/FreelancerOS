'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowLeft, Edit, Send, Download, CheckCircle } from 'lucide-react'
import type { ContractDetail } from '@/types/api'

export default function ContractDetailPage() {
  const params = useParams()
  const [contract, setContract] = React.useState<ContractDetail | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch(`/api/contracts/${params.id}`).then(r => (r.ok ? r.json() : null)).then(d => { setContract(d); setLoading(false) }).catch(() => setLoading(false))
  }, [params.id])

  const updateStatus = async (status: 'SENT' | 'SIGNED', message: string) => {
    const stamp = new Date().toISOString()
    const patch = status === 'SENT' ? { status, sentAt: stamp } : { status, signedAt: stamp }
    // the [id] route only implements PUT (a partial prisma update), not PATCH
    const res = await fetch(`/api/contracts/${params.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) })
    if (!res.ok) return toast.error('Failed to update contract')
    toast.success(message)
    setContract((p) => (p ? { ...p, ...patch } : p))
  }
  const handleSend = () => updateStatus('SENT', 'Contract sent')
  const handleSigned = () => updateStatus('SIGNED', 'Contract marked as signed')

  const statusColors: Record<string, string> = { DRAFT: 'bg-gray-500', SENT: 'bg-blue-500', SIGNED: 'bg-green-500', EXPIRED: 'bg-red-500' }

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>
  if (!contract) return <div className="p-6 text-destructive">Contract not found</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link aria-label="Back" href="/contracts"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{contract.name}</h1>
          <p className="text-sm text-muted-foreground">{contract.client?.name || 'No client'}</p>
        </div>
        <div className="flex gap-2">
          {contract.status !== 'SIGNED' && (
            <>
              <Button variant="outline" asChild><Link href={`/contracts/${contract.id}/edit`}><Edit className="w-4 h-4 mr-2" />Edit</Link></Button>
              {contract.status === 'DRAFT' && <Button variant="outline" onClick={handleSend}><Send className="w-4 h-4 mr-2" />Send</Button>}
              <Button variant="outline" onClick={() => window.print()}><Download className="w-4 h-4 mr-2" />PDF</Button>
              <Button onClick={handleSigned}><CheckCircle className="w-4 h-4 mr-2" />Mark as Signed</Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-sm text-muted-foreground">Value</p><p className="text-2xl font-bold">{formatCurrency(contract.total || 0)}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-sm text-muted-foreground">Status</p><Badge className={`mt-1 ${statusColors[contract.status] || 'bg-gray-500'}`}>{contract.status}</Badge></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-sm text-muted-foreground">Sent</p><p className="text-lg font-medium">{contract.sentAt ? formatDate(contract.sentAt) : '—'}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-sm text-muted-foreground">Expires</p><p className="text-lg font-medium">{contract.expiresAt ? formatDate(contract.expiresAt) : '—'}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Contract Content</CardTitle></CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{contract.content || 'No content'}</p>
        </CardContent>
      </Card>

      {contract.signedAt && <p className="text-sm text-muted-foreground">Signed: {formatDate(contract.signedAt)}</p>}
    </div>
  )
}
