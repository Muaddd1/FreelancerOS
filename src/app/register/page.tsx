'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [form, setForm] = React.useState({ name: '', email: '', password: '', workspace: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Account created! Please sign in.')
        router.push('/login')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Registration failed')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50/50 dark:bg-[#0A0A0D] p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center">
              <span className="text-white dark:text-zinc-900 font-bold text-base">SA</span>
            </div>
          </Link>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">Start managing your agency today</p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-[#0F0F12] border border-zinc-200 dark:border-[#151518] rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Jane Smith"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-10"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@agency.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-10"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="h-10"
                required
                minLength={6}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="workspace" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Workspace Name
              </Label>
              <Input
                id="workspace"
                type="text"
                placeholder="Smith Creative"
                value={form.workspace}
                onChange={(e) => setForm({ ...form, workspace: e.target.value })}
                className="h-10"
                required
              />
            </div>
            <Button type="submit" className="w-full h-10 text-sm font-medium" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-4">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-foreground hover:underline">
              Sign in
            </Link>
          </p>

          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
