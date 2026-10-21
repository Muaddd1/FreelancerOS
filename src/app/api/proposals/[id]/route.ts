import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { proposalFields, proposalItems } from '@/lib/proposals'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const proposal = await prisma.proposal.findUnique({
    where: { id: params.id },
    include: { client: true, project: true, items: true },
  })
  if (!proposal) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(proposal)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const items = proposalItems(body.items)
    const proposal = await prisma.proposal.update({
      where: { id: params.id },
      data: { ...proposalFields(body), ...(items && { items: { deleteMany: {}, create: items } }) },
      include: { items: true },
    })
    return NextResponse.json(proposal)
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.proposal.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
