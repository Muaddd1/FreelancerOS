'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, UserPlus, FolderKanban, Receipt, FileText, CheckSquare, Calendar, DollarSign, Clock, MessageSquare } from 'lucide-react'

export function QuickCreate() {
  const router = useRouter()

  const items = [
    { label: 'New Lead', href: '/leads/new', icon: UserPlus },
    { label: 'New Client', href: '/clients/new', icon: UserPlus },
    { label: 'New Project', href: '/projects/new', icon: FolderKanban },
    { label: 'New Task', href: '/tasks/new', icon: CheckSquare },
    { label: 'New Proposal', href: '/proposals/new', icon: FileText },
    { label: 'New Invoice', href: '/invoices/new', icon: Receipt },
    { label: 'New Expense', href: '/expenses/new', icon: DollarSign },
    { label: 'New Event', href: '/calendar', icon: Calendar },
    { label: 'New Message', href: '/messages/new', icon: MessageSquare },
    { label: 'Time Entry', href: '/time', icon: Clock },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Create New</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Create New</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item) => (
          <DropdownMenuItem key={item.href} onClick={() => router.push(item.href)}>
            <item.icon className="w-4 h-4 mr-2 text-muted-foreground" />
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
