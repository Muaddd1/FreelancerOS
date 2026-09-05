import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  status: z.string().default('ACTIVE'),
  notes: z.string().optional(),
})

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  clientId: z.string().optional(),
  status: z.string().default('ACTIVE'),
  priority: z.string().default('MEDIUM'),
  budget: z.number().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
})

export const taskSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  description: z.string().optional(),
  projectId: z.string().optional(),
  clientId: z.string().optional(),
  status: z.string().default('TODO'),
  priority: z.string().default('MEDIUM'),
  dueDate: z.date().optional(),
  estimatedHours: z.number().optional(),
})

export const invoiceSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  projectId: z.string().optional(),
  number: z.string().min(1, 'Invoice number is required'),
  status: z.string().default('DRAFT'),
  issueDate: z.date().default(() => new Date()),
  dueDate: z.date(),
  subtotal: z.number().default(0),
  tax: z.number().default(0),
  discount: z.number().default(0),
  total: z.number().default(0),
})

export const invoiceItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  description: z.string().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  price: z.number().min(0, 'Price must be positive'),
})

export const proposalSchema = z.object({
  name: z.string().min(1, 'Proposal name is required'),
  clientId: z.string().optional(),
  projectId: z.string().optional(),
  content: z.string().optional(),
  status: z.string().default('DRAFT'),
  expiresAt: z.date().optional(),
})

export const contractSchema = z.object({
  name: z.string().min(1, 'Contract name is required'),
  clientId: z.string().optional(),
  projectId: z.string().optional(),
  content: z.string().optional(),
  status: z.string().default('DRAFT'),
  total: z.number().default(0),
  expiresAt: z.date().optional(),
})

export const expenseSchema = z.object({
  name: z.string().min(1, 'Expense name is required'),
  category: z.string().min(1, 'Category is required'),
  amount: z.number().min(0.01, 'Amount must be positive'),
  date: z.date(),
  projectId: z.string().optional(),
  receipt: z.string().optional(),
  note: z.string().optional(),
})

export const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.string().default('NEW'),
  source: z.string().optional(),
  value: z.number().optional(),
  notes: z.string().optional(),
})

export const timeEntrySchema = z.object({
  projectId: z.string().optional(),
  taskId: z.string().optional(),
  description: z.string().optional(),
  startTime: z.date(),
  endTime: z.date().optional(),
  billable: z.boolean().default(true),
})

export const messageSchema = z.object({
  clientId: z.string().optional(),
  projectId: z.string().optional(),
  content: z.string().min(1, 'Message cannot be empty'),
})
