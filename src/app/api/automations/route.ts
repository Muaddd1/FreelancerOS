import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const automations = await prisma.automation.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(automations)
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const automation = await prisma.automation.create({
      data: {
        ...data,
        workspaceId: data.workspaceId || 'demo-workspace',
        userId: data.userId || 'demo-user',
      },
    })
    return NextResponse.json(automation, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create automation' }, { status: 500 })
  }
}
