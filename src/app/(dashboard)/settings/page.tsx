'use client'

import * as React from 'react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { User, Building2, CreditCard, Shield, ArrowRight } from 'lucide-react'

const settings = [
  { title: 'Profile', description: 'Update your name, email, and avatar', href: '/settings/profile', icon: User },
  { title: 'Business', description: 'Company name, logo, and business details', href: '/settings/business', icon: Building2 },
  { title: 'Billing', description: 'Subscription, invoices, and payment methods', href: '/settings/billing', icon: CreditCard },
  { title: 'Security', description: 'Password and two-factor authentication', href: '/settings/security', icon: Shield },
]

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader title="Settings" description="Manage your account and preferences" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settings.map(item => (
          <Link key={item.href} href={item.href}>
            <div className="group p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-150 flex items-center gap-4">
              <div className="p-2.5 bg-zinc-100 dark:bg-[#18181C] rounded-lg shrink-0">
                <item.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
