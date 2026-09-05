import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const tasks = await prisma.task.findMany({
    include: { project: true, client: true, timeEntries: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(tasks)
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const task = await prisma.task.create({
      data: {
        ...data,
        workspaceId: data.workspaceId || 'demo-workspace',
        userId: data.userId || 'demo-user',
      },
      include: { project: true },
    })
    return NextResponse.json(task, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
