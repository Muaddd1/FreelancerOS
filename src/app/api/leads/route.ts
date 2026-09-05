import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(leads)
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const lead = await prisma.lead.create({
      data: {
        ...data,
        workspaceId: data.workspaceId || 'demo-workspace',
        userId: data.userId || 'demo-user',
      },
    })
    return NextResponse.json(lead, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}
