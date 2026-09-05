'use client'

import * as React from 'react'
import { Bell, Search, Command } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CommandPalette } from './command-palette'
import { ThemeSwitcher } from '@/components/theme-switcher'

export function DashboardHeader({ title, description, action }: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {action}
        <ThemeSwitcher />
        <HeaderSearch />
        <NotificationBell />
      </div>
    </div>
  )
}

export function HeaderSearch() {
  return (
    <CommandPalette>
      <Button variant="outline" className="gap-2 h-9 px-3 text-muted-foreground border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700">
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline text-xs">Search...</span>
        <kbd className="hidden sm:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-1.5 font-mono text-2xs text-muted-foreground">
          <Command className="w-3 h-3" />K
        </kbd>
      </Button>
    </CommandPalette>
  )
}

export function NotificationBell() {
  return (
    <Button variant="outline" size="icon" className="relative h-9 w-9 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700">
      <Bell className="w-4 h-4" />
      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-zinc-900 dark:bg-white rounded-full" />
    </Button>
  )
}
