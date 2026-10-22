import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { lineItems, toData } from '@/lib/prisma-data'

export async function GET() {
  const proposals = await prisma.proposal.findMany({
    include: { client: true, project: true, items: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(proposals)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const items = lineItems(body.items)
    const proposal = await prisma.proposal.create({
      data: {
        ...toData('Proposal', body),
        name: body.name,
        workspaceId: body.workspaceId || 'demo-workspace',
        userId: body.userId || 'demo-user',
        ...(items && { items: { create: items } }),
      },
      include: { client: true, items: true },
    })
    return NextResponse.json(proposal, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create proposal' }, { status: 500 })
  }
}
