import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const proposals = await prisma.proposal.findMany({
    include: { client: true, project: true, items: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(proposals)
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const proposal = await prisma.proposal.create({
      data: {
        ...data,
        workspaceId: data.workspaceId || 'demo-workspace',
        userId: data.userId || 'demo-user',
      },
      include: { client: true, items: true },
    })
    return NextResponse.json(proposal, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create proposal' }, { status: 500 })
  }
}
