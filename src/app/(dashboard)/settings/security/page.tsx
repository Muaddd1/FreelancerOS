'use client'

import * as React from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { DashboardHeader } from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Key, Smartphone } from 'lucide-react'

export default function SecuritySettingsPage() {
  const [loading, setLoading] = React.useState(false)
  const [form, setForm] = React.useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) { toast.error('Passwords do not match'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Password updated')
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setLoading(false)
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <DashboardHeader title="Security Settings" description="Manage your account security" />
      </div>

      {/* Password Section */}
      <div className="bg-white dark:bg-[#0F0F12] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Change Password</h2>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Current Password</Label>
            <Input type="password" value={form.currentPassword} onChange={e => setForm({ ...form, currentPassword: e.target.value })} className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">New Password</Label>
            <Input type="password" value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Confirm New Password</Label>
            <Input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} className="h-10" />
          </div>
          <Button type="submit" disabled={loading} className="h-10 text-sm font-medium">
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </div>

      {/* 2FA Section */}
      <div className="bg-white dark:bg-[#0F0F12] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Two-Factor Authentication</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Authenticator App</p>
              <p className="text-xs text-muted-foreground">Use an authenticator app to generate codes</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">SMS Verification</p>
              <p className="text-xs text-muted-foreground">Receive codes via text message</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      {/* Sessions Section */}
      <div className="bg-white dark:bg-[#0F0F12] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Active Sessions</h2>
        </div>
        <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-[#18181C] rounded-lg">
          <div>
            <p className="text-sm font-medium text-foreground">Current Session</p>
            <p className="text-xs text-muted-foreground">Windows · Chrome · Active now</p>
          </div>
          <Badge variant="default" className="text-xs">Active</Badge>
        </div>
      </div>
    </div>
  )
}
