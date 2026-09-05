'use client'

import * as React from 'react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from 'cmdk'
import { useRouter } from 'next/navigation'
import { Search, Plus, LayoutDashboard, Users, FolderKanban, Receipt, FileText, Settings, Clock } from 'lucide-react'

const quickActions = [
  { label: 'New Client', icon: Users, href: '/clients/new' },
  { label: 'New Project', icon: FolderKanban, href: '/projects/new' },
  { label: 'New Invoice', icon: Receipt, href: '/invoices/new' },
  { label: 'New Proposal', icon: FileText, href: '/proposals/new' },
  { label: 'Start Timer', icon: Clock, href: '/time' },
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Settings', icon: Settings, href: '/settings' },
]

export function CommandPalette({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {children}
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-popover rounded-xl shadow-2xl border border-[#232328] dark:border-[#232328] z-50">
            <CommandInput
              placeholder="Search or type a command..."
              className="w-full px-4 py-3 border-b border-[#232328] dark:border-[#232328] outline-none text-sm bg-popover text-popover-foreground"
            />
            <CommandList className="max-h-80 overflow-y-auto p-2">
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </CommandEmpty>
              <CommandGroup heading="Quick Actions">
                {quickActions.map((action) => (
                  <CommandItem
                    key={action.href}
                    onSelect={() => {
                      router.push(action.href)
                      setOpen(false)
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-accent dark:hover:bg-[#18181C]"
                  >
                    <action.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-popover-foreground">{action.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </div>
        </div>
      </CommandDialog>
    </>
  )
}
