'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, UserPlus, FolderKanban, CheckSquare,
  Calendar, Clock, FileText, FileCheck, Receipt, CreditCard,
  DollarSign, BarChart3, MessageSquare, FolderOpen, Zap,
  FileStack, Settings, ChevronDown, Plus, LogOut, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Navigation groups
const mainNav = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Clients', href: '/clients', icon: Users },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Tasks', href: '/tasks', icon: CheckSquare },
  { label: 'Time', href: '/time', icon: Clock },
]

const workNav = [
  { label: 'Proposals', href: '/proposals', icon: FileText },
  { label: 'Contracts', href: '/contracts', icon: FileCheck },
  { label: 'Invoices', href: '/invoices', icon: Receipt },
  { label: 'Payments', href: '/payments', icon: CreditCard },
]

const manageNav = [
  { label: 'Leads', href: '/leads', icon: UserPlus },
  { label: 'Expenses', href: '/expenses', icon: DollarSign },
  { label: 'Files', href: '/files', icon: FolderOpen },
  { label: 'Messages', href: '/messages', icon: MessageSquare },
]

const toolsNav = [
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Calendar', href: '/calendar', icon: Calendar },
  { label: 'Automations', href: '/automations', icon: Zap },
  { label: 'Templates', href: '/templates', icon: FileStack },
]

function NavItem({ item, isActive }: { item: any; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        'group flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-all duration-150',
        isActive
          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'
          : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900'
      )}
    >
      <item.icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300')} />
      {item.label}
    </Link>
  )
}

function NavGroup({ label, items }: { label: string; items: any[] }) {
  const pathname = usePathname()
  return (
    <div className="space-y-0.5">
      <p className="text-2xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider px-2.5 mb-1">
        {label}
      </p>
      {items.map(item => (
        <NavItem key={item.href} item={item} isActive={pathname === item.href || pathname?.startsWith(item.href + '/')} />
      ))}
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-56 border-r border-zinc-100 dark:border-[#151518] bg-white dark:bg-[#0A0A0D] h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="px-4 py-3.5 border-b border-zinc-100 dark:border-[#151518]">
        <Link href="/dashboard" className="block">
          <span className="font-semibold text-base tracking-tight text-zinc-900 dark:text-white">
            SaaS App
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        <NavGroup label="Main" items={mainNav} />
        <NavGroup label="Work" items={workNav} />
        <NavGroup label="Manage" items={manageNav} />
        <NavGroup label="Tools" items={toolsNav} />
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-zinc-100 dark:border-[#151518] space-y-0.5">
        <Link
          href="/settings"
          className={cn(
            'group flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-all duration-150',
            pathname === '/settings' || pathname?.startsWith('/settings/')
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900'
          )}
        >
          <Settings className={cn('w-4 h-4 flex-shrink-0', pathname === '/settings' || pathname?.startsWith('/settings/') ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300')} />
          Settings
        </Link>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-150">
              <Avatar className="w-6 h-6 shrink-0">
                <AvatarFallback className="text-2xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  DE
                </AvatarFallback>
              </Avatar>
              <span className="flex-1 text-left truncate">Demo User</span>
              <ChevronDown className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-medium leading-none">Demo User</p>
                <p className="text-xs leading-none text-muted-foreground">demo@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings/profile" className="cursor-pointer">Profile Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/billing" className="cursor-pointer">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/api/auth/signout" className="cursor-pointer text-red-500 dark:text-red-400 focus:text-red-500 dark:focus:text-red-400">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  const allNavItems = [
    ...mainNav,
    ...workNav,
    ...manageNav,
    ...toolsNav,
  ]

  return (
    <>
      {/* Mobile header */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-[#151518] bg-white dark:bg-[#0A0A0D]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="font-semibold text-base tracking-tight text-zinc-900 dark:text-white">
            SaaS App
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="h-9 w-9">
            {open ? (
              <X className="w-4 h-4 text-zinc-500" />
            ) : (
              <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </Button>
        </div>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-in menu */}
      <div
        className={cn(
          'lg:hidden fixed top-0 right-0 z-50 h-full w-80 bg-white dark:bg-[#0A0A0D] border-l border-zinc-100 dark:border-[#151518] transition-transform duration-200 ease-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Menu header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-100 dark:border-[#151518]">
          <span className="font-semibold text-base tracking-tight text-zinc-900 dark:text-white">
            Menu
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Menu nav */}
        <nav className="p-3 space-y-4 overflow-y-auto h-full pb-24">
          <NavGroup label="Main" items={mainNav} />
          <NavGroup label="Work" items={workNav} />
          <NavGroup label="Manage" items={manageNav} />
          <NavGroup label="Tools" items={toolsNav} />

          <div className="border-t border-zinc-100 dark:border-[#151518] pt-4">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className={cn(
                'group flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-all duration-150',
                pathname === '/settings' || pathname?.startsWith('/settings/')
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900'
              )}
            >
              <Settings className={cn('w-4 h-4 flex-shrink-0', pathname === '/settings' || pathname?.startsWith('/settings/') ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300')} />
              Settings
            </Link>
          </div>
        </nav>
      </div>
    </>
  )
}
