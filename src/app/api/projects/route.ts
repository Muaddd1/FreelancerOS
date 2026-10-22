import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { toData } from '@/lib/prisma-data'

export async function GET() {
  const projects = await prisma.project.findMany({
    include: {
      client: true,
      tasks: true,
      invoices: true,
      _count: { select: { tasks: true, invoices: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(projects)
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const project = await prisma.project.create({
      data: {
        ...toData('Project', data),
        workspaceId: data.workspaceId || 'demo-workspace',
        userId: data.userId || 'demo-user',
      },
    })
    return NextResponse.json(project, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
