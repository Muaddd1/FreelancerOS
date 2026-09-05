'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DashboardHeader } from '@/components/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowLeft, Edit, Send, Download, CheckCircle } from 'lucide-react'

export default function ContractDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [contract, setContract] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch(`/api/contracts/${params.id}`).then(r => r.json()).then(d => { setContract(d); setLoading(false) }).catch(() => setLoading(false))
  }, [params.id])

  const handleSend = async () => {
    await fetch(`/api/contracts/${params.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'SENT' }) })
    toast.success('Contract sent')
    setContract((p: any) => ({ ...p, status: 'SENT' }))
  }

  const handleSigned = async () => {
    await fetch(`/api/contracts/${params.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'SIGNED' }) })
    toast.success('Contract marked as signed')
    setContract((p: any) => ({ ...p, status: 'SIGNED' }))
  }

  const statusColors: Record<string, string> = { DRAFT: 'bg-gray-500', SENT: 'bg-blue-500', SIGNED: 'bg-green-500', EXPIRED: 'bg-red-500' }

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>
  if (!contract || contract.error) return <div className="p-6 text-destructive">Contract not found</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/contracts"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link>
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
        <Card><CardContent className="p-4 text-center"><p className="text-sm text-muted-foreground">Value</p><p className="text-2xl font-bold">{formatCurrency(contract.value || 0)}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-sm text-muted-foreground">Status</p><Badge className={`mt-1 ${statusColors[contract.status] || 'bg-gray-500'}`}>{contract.status}</Badge></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-sm text-muted-foreground">Start Date</p><p className="text-lg font-medium">{formatDate(contract.startDate)}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-sm text-muted-foreground">End Date</p><p className="text-lg font-medium">{formatDate(contract.endDate)}</p></CardContent></Card>
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
