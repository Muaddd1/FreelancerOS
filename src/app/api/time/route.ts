import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const entries = await prisma.timeEntry.findMany({
    include: { project: true, task: true },
    orderBy: { startTime: 'desc' },
  })
  return NextResponse.json(entries)
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const entry = await prisma.timeEntry.create({
      data: {
        ...data,
        workspaceId: data.workspaceId || 'demo-workspace',
        userId: data.userId || 'demo-user',
      },
    })
    return NextResponse.json(entry, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create time entry' }, { status: 500 })
  }
}
