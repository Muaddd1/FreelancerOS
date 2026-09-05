'use client'

import * as React from 'react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Check } from 'lucide-react'

export default function BillingSettingsPage() {
  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <DashboardHeader title="Billing Settings" description="Manage your subscription and invoices" />
      </div>

      {/* Current Plan */}
      <div className="bg-white dark:bg-[#0F0F12] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Current Plan</h2>
        <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-[#18181C] rounded-lg">
          <div>
            <p className="font-semibold text-foreground">Freelancer OS</p>
            <p className="text-xs text-muted-foreground mt-0.5">Unlimited clients, projects, and invoices</p>
          </div>
          <Badge variant="default" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Active</Badge>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Billing cycle</span>
            <span className="text-foreground">Monthly</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Next billing date</span>
            <span className="text-foreground">October 5, 2026</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-semibold text-foreground">$29.00/month</span>
          </div>
        </div>
      </div>

      {/* Plan Features */}
      <div className="bg-white dark:bg-[#0F0F12] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Plan Features</h2>
        <div className="grid grid-cols-2 gap-2">
          {['Unlimited Clients', 'Unlimited Projects', 'Unlimited Invoices', 'Proposal Templates', 'Time Tracking', 'Analytics', 'File Storage', 'Email Support'].map(feature => (
            <div key={feature} className="flex items-center gap-2 text-sm">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Plan */}
      <div className="bg-white dark:bg-[#0F0F12] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Upgrade Your Plan</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg">
            <div>
              <p className="text-sm font-medium text-foreground">Source Code</p>
              <p className="text-xs text-muted-foreground">Full source code, deploy once, own forever</p>
            </div>
            <a href="https://muadme.gumroad.com/l/Freelancer" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="h-8 text-xs">$149 — Buy Once</Button>
            </a>
          </div>
          <div className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg">
            <div>
              <p className="text-sm font-medium text-foreground">Monthly Membership</p>
              <p className="text-xs text-muted-foreground">Full access, cancel anytime</p>
            </div>
            <a href="https://muadme.gumroad.com/l/FreelancerOS" target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="h-8 text-xs">$29/month</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
