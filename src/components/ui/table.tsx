import { cn } from '@/lib/utils'

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-auto">
      <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
}
export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn('[&_tr]:border-b border-zinc-200 dark:border-zinc-800', className)} {...props} />
  )
}
export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  )
}
export function TableFooter({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot className={cn('border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181C] font-medium', className)} {...props} />
  )
}
export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn('border-b border-zinc-100 dark:border-zinc-800 transition-colors hover:bg-zinc-50 dark:hover:bg-[#0A0A0D]', className)} {...props} />
  )
}
export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={cn('h-10 px-3 text-left align-middle font-medium text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider [&:has([role=checkbox])]:pr-0', className)} {...props} />
  )
}
export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('p-3 align-middle [&:has([role=checkbox])]:pr-0', className)} {...props} />
  )
}
export function TableCaption({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <caption className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
  )
}
