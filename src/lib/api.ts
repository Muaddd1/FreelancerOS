import { prisma } from '@/lib/db'

export async function getServerUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      workspace: {
        include: { workspace: true },
      },
    },
  })
}

export async function getWorkspaceClients(workspaceId: string) {
  return prisma.client.findMany({
    where: { workspaceId },
    include: {
      projects: true,
      invoices: true,
      _count: { select: { projects: true, invoices: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getWorkspaceProjects(workspaceId: string) {
  return prisma.project.findMany({
    where: { workspaceId },
    include: {
      client: true,
      tasks: true,
      invoices: true,
      _count: { select: { tasks: true, invoices: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getWorkspaceInvoices(workspaceId: string) {
  return prisma.invoice.findMany({
    where: { workspaceId },
    include: {
      client: true,
      project: true,
      payments: true,
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getWorkspaceProposals(workspaceId: string) {
  return prisma.proposal.findMany({
    where: { workspaceId },
    include: {
      client: true,
      project: true,
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getWorkspaceTasks(workspaceId: string) {
  return prisma.task.findMany({
    where: { workspaceId },
    include: {
      project: true,
      client: true,
      timeEntries: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getWorkspaceLeads(workspaceId: string) {
  return prisma.lead.findMany({
    where: { workspaceId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getWorkspaceExpenses(workspaceId: string) {
  return prisma.expense.findMany({
    where: { workspaceId },
    include: { project: true },
    orderBy: { date: 'desc' },
  })
}

export async function getWorkspacePayments(workspaceId: string) {
  return prisma.payment.findMany({
    where: { workspaceId },
    include: {
      invoice: true,
      client: true,
    },
    orderBy: { date: 'desc' },
  })
}

export async function getWorkspaceActivities(workspaceId: string, limit = 50) {
  return prisma.activity.findMany({
    where: { workspaceId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

export async function getWorkspaceNotifications(workspaceId: string, userId: string) {
  return prisma.notification.findMany({
    where: { workspaceId, userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
}

export async function getWorkspaceTimeEntries(workspaceId: string) {
  return prisma.timeEntry.findMany({
    where: { workspaceId },
    include: {
      project: true,
      task: true,
    },
    orderBy: { startTime: 'desc' },
  })
}

export async function logActivity(
  workspaceId: string,
  userId: string,
  type: string,
  description: string,
  clientId?: string,
  projectId?: string
) {
  return prisma.activity.create({
    data: { workspaceId, userId, type, description, clientId, projectId },
  })
}
