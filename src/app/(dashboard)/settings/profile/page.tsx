'use client'

import * as React from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { DashboardHeader } from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

export default function ProfileSettingsPage() {
  const [loading, setLoading] = React.useState(false)
  const [form, setForm] = React.useState({ name: '', email: '', phone: '' })

  React.useEffect(() => {
    fetch('/api/users/me').then(r => r.ok ? r.json() : null).then(d => {
      if (d) setForm({ name: d.name || '', email: d.email || '', phone: d.phone || '' })
    }).catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/users/me', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) toast.success('Profile updated')
      else toast.error('Failed to update profile')
    } catch { toast.error('Failed to update profile') } finally { setLoading(false) }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <DashboardHeader title="Profile Settings" description="Manage your account details" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-[#0F0F12] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Personal Information</h2>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Name</Label>
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Email</Label>
            <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Phone</Label>
            <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="h-10" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="h-10 text-sm font-medium">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
