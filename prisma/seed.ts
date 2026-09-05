import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.activity.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.message.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.invoiceReminder.deleteMany()
  await prisma.invoiceItem.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.proposalItem.deleteMany()
  await prisma.proposal.deleteMany()
  await prisma.contract.deleteMany()
  await prisma.expense.deleteMany()
  await prisma.timeEntry.deleteMany()
  await prisma.task.deleteMany()
  await prisma.milestone.deleteMany()
  await prisma.file.deleteMany()
  await prisma.project.deleteMany()
  await prisma.lead.deleteMany()
  await prisma.client.deleteMany()
  await prisma.automation.deleteMany()
  await prisma.template.deleteMany()
  await prisma.workspaceUser.deleteMany()
  await prisma.workspace.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  // Create workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Demo Agency',
      slug: 'demo-agency',
      email: 'hello@demoagency.com',
      phone: '+1 555 123 4567',
      address: '123 Business St, New York, NY 10001',
      website: 'https://demoagency.com',
      taxRate: 10,
      currency: 'USD',
      hourlyRate: 150,
    },
  })

  // Create demo user
  const user = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'demo123',
      role: 'ADMIN',
      workspace: {
        create: {
          workspaceId: workspace.id,
          role: 'OWNER',
        },
      },
    },
  })

  // Create clients
  const acme = await prisma.client.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      name: 'Acme Studio',
      email: 'contact@acmestudio.com',
      phone: '+1 555 100 2000',
      company: 'Acme Design Studio',
      address: '456 Creative Ave, Los Angeles, CA 90001',
      website: 'https://acmestudio.com',
      status: 'ACTIVE',
    },
  })

  const techCorp = await prisma.client.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      name: 'TechCorp Solutions',
      email: 'projects@techcorp.io',
      phone: '+1 555 300 4000',
      company: 'TechCorp Solutions Inc',
      address: '789 Tech Park, San Francisco, CA 94102',
      website: 'https://techcorp.io',
      status: 'ACTIVE',
    },
  })

  const brightMedia = await prisma.client.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      name: 'Bright Media',
      email: 'hello@brightmedia.co',
      phone: '+1 555 500 6000',
      company: 'Bright Media Group',
      status: 'PROSPECT',
    },
  })

  // Create projects
  const acmeProject = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      clientId: acme.id,
      name: 'Website Redesign',
      description: 'Complete redesign of the Acme Studio website with modern UI/UX',
      status: 'ACTIVE',
      priority: 'HIGH',
      budget: 15000,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-04-30'),
    },
  })

  const techProject = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      clientId: techCorp.id,
      name: 'Mobile App Development',
      description: 'iOS and Android app for TechCorp internal tools',
      status: 'ACTIVE',
      priority: 'MEDIUM',
      budget: 35000,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-07-31'),
    },
  })

  const brightProject = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      clientId: brightMedia.id,
      name: 'Brand Identity Package',
      description: 'Logo, brand guidelines, and stationery design',
      status: 'COMPLETED',
      priority: 'LOW',
      budget: 5000,
      startDate: new Date('2023-11-01'),
      endDate: new Date('2024-01-31'),
      completedAt: new Date('2024-01-28'),
    },
  })

  // Create tasks
  const tasks = [
    { projectId: acmeProject.id, name: 'Homepage Design', status: 'DONE', priority: 'HIGH', dueDate: new Date('2024-02-15') },
    { projectId: acmeProject.id, name: 'About Page', status: 'DONE', priority: 'MEDIUM', dueDate: new Date('2024-02-28') },
    { projectId: acmeProject.id, name: 'Services Page', status: 'IN_PROGRESS', priority: 'MEDIUM', dueDate: new Date('2024-03-15') },
    { projectId: acmeProject.id, name: 'Contact Form', status: 'TODO', priority: 'LOW', dueDate: new Date('2024-03-30') },
    { projectId: acmeProject.id, name: 'Responsive Testing', status: 'TODO', priority: 'HIGH', dueDate: new Date('2024-04-15') },
    { projectId: techProject.id, name: 'API Integration', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: new Date('2024-03-20') },
    { projectId: techProject.id, name: 'User Authentication', status: 'DONE', priority: 'HIGH', dueDate: new Date('2024-02-20') },
    { projectId: techProject.id, name: 'Dashboard UI', status: 'TODO', priority: 'MEDIUM', dueDate: new Date('2024-04-01') },
  ]

  for (const task of tasks) {
    await prisma.task.create({
      data: { ...task, workspaceId: workspace.id, userId: user.id },
    })
  }

  // Create invoices
  const inv1 = await prisma.invoice.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      clientId: acme.id,
      projectId: acmeProject.id,
      number: 'INV-2024-1001',
      status: 'PAID',
      issueDate: new Date('2024-02-01'),
      dueDate: new Date('2024-03-01'),
      subtotal: 5000,
      tax: 500,
      discount: 0,
      total: 5500,
      paid: 5500,
      paidAt: new Date('2024-02-28'),
    },
  })

  await prisma.invoiceItem.createMany({
    data: [
      { invoiceId: inv1.id, name: 'Homepage Design', description: 'Custom homepage design with animations', quantity: 1, price: 2500 },
      { invoiceId: inv1.id, name: 'About Page Design', description: 'About page with team section', quantity: 1, price: 1500 },
      { invoiceId: inv1.id, name: 'Revision Rounds', description: '3 rounds of revisions', quantity: 2, price: 500 },
    ],
  })

  const inv2 = await prisma.invoice.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      clientId: acme.id,
      projectId: acmeProject.id,
      number: 'INV-2024-1002',
      status: 'SENT',
      issueDate: new Date('2024-03-01'),
      dueDate: new Date('2024-04-01'),
      subtotal: 5000,
      tax: 500,
      discount: 0,
      total: 5500,
      paid: 0,
      sentAt: new Date('2024-03-01'),
    },
  })

  await prisma.invoiceItem.createMany({
    data: [
      { invoiceId: inv2.id, name: 'Services Page Development', description: 'Services page with animations', quantity: 1, price: 3000 },
      { invoiceId: inv2.id, name: 'Contact Form Integration', description: 'Form with validation', quantity: 1, price: 1500 },
      { invoiceId: inv2.id, name: 'Deployment', description: 'Hosting setup and deployment', quantity: 1, price: 500 },
    ],
  })

  await prisma.invoice.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      clientId: techCorp.id,
      projectId: techProject.id,
      number: 'INV-2024-2001',
      status: 'DRAFT',
      issueDate: new Date('2024-03-15'),
      dueDate: new Date('2024-04-15'),
      subtotal: 8750,
      tax: 875,
      discount: 0,
      total: 9625,
      paid: 0,
    },
  })

  // Create payments
  await prisma.payment.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      clientId: acme.id,
      invoiceId: inv1.id,
      amount: 5500,
      method: 'BANK_TRANSFER',
      reference: 'TRF-2024-0228',
      date: new Date('2024-02-28'),
    },
  })

  // Create proposals
  await prisma.proposal.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      clientId: brightMedia.id,
      name: 'Social Media Marketing Package',
      content: 'Complete social media management including content creation, scheduling, and analytics reporting.',
      status: 'ACCEPTED',
      total: 4500,
      sentAt: new Date('2024-01-10'),
      viewedAt: new Date('2024-01-11'),
      acceptedAt: new Date('2024-01-15'),
    },
  })

  await prisma.proposal.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      clientId: techCorp.id,
      name: 'Mobile App Phase 2',
      content: 'Phase 2 development including push notifications, offline mode, and analytics.',
      status: 'SENT',
      total: 12000,
      sentAt: new Date('2024-03-01'),
      viewedAt: new Date('2024-03-02'),
      expiresAt: new Date('2024-04-01'),
    },
  })

  // Create contracts
  await prisma.contract.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      clientId: acme.id,
      projectId: acmeProject.id,
      name: 'Website Redesign Agreement',
      content: 'Full website redesign contract with milestones and payment schedule.',
      status: 'SIGNED',
      total: 15000,
      signedAt: new Date('2024-01-14'),
      sentAt: new Date('2024-01-10'),
    },
  })

  // Create leads
  await prisma.lead.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      name: 'Sarah Johnson',
      email: 'sarah@startup.io',
      phone: '+1 555 700 8000',
      company: 'Startup.io',
      status: 'QUALIFIED',
      source: 'Website',
      value: 25000,
    },
  })

  await prisma.lead.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      name: 'Michael Chen',
      email: 'michael@ecommerce.com',
      phone: '+1 555 900 1000',
      company: 'E-Commerce Plus',
      status: 'NEW',
      source: 'Referral',
      value: 18000,
    },
  })

  // Create expenses
  const expenses = [
    { category: 'Software', name: 'Figma Annual License', amount: 144, date: new Date('2024-01-05') },
    { category: 'Hosting', name: 'Vercel Pro Plan', amount: 240, date: new Date('2024-01-15') },
    { category: 'Contractor', name: 'Freelance Developer - UI', amount: 2500, date: new Date('2024-02-15'), projectId: acmeProject.id },
    { category: 'Software', name: 'Adobe Creative Cloud', amount: 599, date: new Date('2024-02-01') },
    { category: 'Hosting', name: 'Domain Renewal - acmeproject.com', amount: 49, date: new Date('2024-03-01') },
  ]

  for (const exp of expenses) {
    await prisma.expense.create({
      data: { ...exp, workspaceId: workspace.id, userId: user.id },
    })
  }

  // Create time entries
  const timeEntries = [
    { projectId: acmeProject.id, description: 'Homepage wireframing', startTime: new Date('2024-01-16T09:00:00'), endTime: new Date('2024-01-16T12:00:00'), duration: 180, billable: true },
    { projectId: acmeProject.id, description: 'Homepage design in Figma', startTime: new Date('2024-01-17T10:00:00'), endTime: new Date('2024-01-17T16:00:00'), duration: 360, billable: true },
    { projectId: acmeProject.id, description: 'Client meeting - design review', startTime: new Date('2024-01-20T14:00:00'), endTime: new Date('2024-01-20T15:30:00'), duration: 90, billable: true },
    { projectId: techProject.id, description: 'API architecture planning', startTime: new Date('2024-02-05T09:00:00'), endTime: new Date('2024-02-05T11:00:00'), duration: 120, billable: true },
  ]

  for (const entry of timeEntries) {
    await prisma.timeEntry.create({
      data: { ...entry, workspaceId: workspace.id, userId: user.id },
    })
  }

  // Create activities
  const activities = [
    { clientId: acme.id, projectId: acmeProject.id, type: 'project_created', description: 'Project "Website Redesign" was created' },
    { clientId: acme.id, type: 'invoice_created', description: 'Invoice INV-2024-1001 was created' },
    { clientId: acme.id, type: 'invoice_paid', description: 'Invoice INV-2024-1001 was marked as paid ($5,500)' },
    { clientId: acme.id, projectId: acmeProject.id, type: 'task_completed', description: 'Task "Homepage Design" was marked as complete' },
    { clientId: techCorp.id, projectId: techProject.id, type: 'project_created', description: 'Project "Mobile App Development" was created' },
    { clientId: brightMedia.id, type: 'proposal_accepted', description: 'Proposal "Social Media Marketing Package" was accepted' },
  ]

  for (const activity of activities) {
    await prisma.activity.create({
      data: { ...activity, workspaceId: workspace.id, userId: user.id },
    })
  }

  // Create notifications
  await prisma.notification.createMany({
    data: [
      { workspaceId: workspace.id, userId: user.id, type: 'invoice', title: 'Invoice Due Soon', message: 'Invoice INV-2024-1002 is due in 7 days', link: '/invoices' },
      { workspaceId: workspace.id, userId: user.id, type: 'project', title: 'Project Deadline Approaching', message: 'Website Redesign is due in 30 days', link: '/projects' },
      { workspaceId: workspace.id, userId: user.id, type: 'lead', title: 'New Lead', message: 'Michael Chen submitted a new lead', link: '/leads' },
    ],
  })

  // Create templates
  await prisma.template.createMany({
    data: [
      { workspaceId: workspace.id, userId: user.id, name: 'Standard Proposal', type: 'proposal', content: '# Proposal\n\n## Scope of Work\n\n## Timeline\n\n## Pricing\n\n## Terms' },
      { workspaceId: workspace.id, userId: user.id, name: 'Freelance Contract', type: 'contract', content: '# Service Agreement\n\n## Parties\n\n## Services\n\n## Payment Terms\n\n## Termination' },
      { workspaceId: workspace.id, userId: user.id, name: 'Standard Invoice', type: 'invoice', content: '# Invoice\n\n## Bill To\n\n## Items\n\n## Subtotal\n\n## Tax\n\n## Total' },
    ],
  })

  // Create automations
  await prisma.automation.createMany({
    data: [
      { workspaceId: workspace.id, userId: user.id, name: 'Invoice Reminder', trigger: 'invoice_due', action: 'send_email', enabled: true, config: JSON.stringify({ daysBefore: 3 }) },
      { workspaceId: workspace.id, userId: user.id, name: 'Lead Follow-up', trigger: 'lead_created', action: 'send_email', enabled: true, config: JSON.stringify({ template: 'welcome' }) },
    ],
  })

  console.log('✅ Seed data created successfully')
  console.log('📧 Demo login: demo@example.com / demo123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
