'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [form, setForm] = React.useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })
      if (result?.error) {
        toast.error('Invalid credentials')
      } else {
        toast.success('Welcome back!')
        router.push('/dashboard')
        router.refresh()
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
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-[#0F0F12] border border-zinc-200 dark:border-[#151518] rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="demo@example.com"
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
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="h-10"
                required
              />
            </div>
            <Button type="submit" className="w-full h-10 text-sm font-medium" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-4">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-foreground hover:underline">
              Create one
            </Link>
          </p>

          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>

        {/* Demo hint */}
        <div className="mt-4 p-3 bg-zinc-100 dark:bg-[#18181C] border border-zinc-200 dark:border-[#151518] rounded-lg text-center">
          <p className="text-xs text-muted-foreground">
            Demo: <span className="font-mono text-foreground">demo@example.com</span> /{' '}
            <span className="font-mono text-foreground">demo123</span>
          </p>
        </div>
      </div>
    </div>
  )
}
