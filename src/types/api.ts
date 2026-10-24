import type { Activity, Client, Contract, Expense, File, Invoice, InvoiceItem, Project, Proposal, ProposalItem, Task, TimeEntry } from '@prisma/client'

// API routes return JSON, so Prisma Date fields arrive as ISO strings.
export type Jsonify<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K] extends Date | null ? string | null : T[K]
}

export type ClientDetail = Jsonify<Client> & {
  projects?: (Jsonify<Project> & { tasks?: Jsonify<Task>[] })[]
  invoices?: Jsonify<Invoice>[]
  proposals?: Jsonify<Proposal>[]
  contracts?: Jsonify<Contract>[]
  activities?: Jsonify<Activity>[]
  _count?: { projects?: number }
}

export type ProjectDetail = Jsonify<Project> & {
  client?: Jsonify<Client> | null
  tasks?: (Jsonify<Task> & { timeEntries?: Jsonify<TimeEntry>[] })[]
  timeEntries?: Jsonify<TimeEntry>[]
  expenses?: Jsonify<Expense>[]
  files?: Jsonify<File>[]
}

export type InvoiceDetail = Jsonify<Invoice> & {
  client?: Jsonify<Client> | null
  project?: Jsonify<Project> | null
  items?: Jsonify<InvoiceItem>[]
}

export type TaskDetail = Jsonify<Task> & {
  project?: Jsonify<Project> | null
  timeEntries?: Jsonify<TimeEntry>[]
}

export type ContractDetail = Jsonify<Contract> & { client?: Jsonify<Client> | null }

export type ProposalDetail = Jsonify<Proposal> & {
  client?: Jsonify<Client> | null
  project?: Jsonify<Project> | null
  items?: Jsonify<ProposalItem>[]
}

// Shapes returned by the list endpoints (GET /api/projects, GET /api/clients).
export type ProjectListItem = Jsonify<Project> & {
  client?: Jsonify<Client> | null
  tasks?: Pick<Task, 'status'>[]
  _count?: { tasks?: number; invoices?: number }
}

export type ClientListItem = Jsonify<Client> & {
  invoices?: Pick<Invoice, 'total' | 'paid'>[]
  _count?: { projects?: number; invoices?: number }
}

// GET /api/analytics
export type AnalyticsStats = {
  totalClients: number
  totalProjects: number
  totalInvoices: number
  totalRevenue: number
  totalExpenses: number
  activeProjects: number
  pendingInvoices: number
  recentActivities: Jsonify<Activity>[]
  profit: number
  invoicesByStatus: Record<string, number>
  avgInvoiceValue: number
  tasksCompleted: number
  projectsCompleted: number
  hoursTracked: number
  revenueByMonth: { month: string; amount: number }[]
  revenueChange: number | null
  expensesChange: number | null
  profitChange: number | null
}
