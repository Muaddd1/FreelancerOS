import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const contracts = await prisma.contract.findMany({
    include: { client: true, project: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(contracts)
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const contract = await prisma.contract.create({
      data: {
        ...data,
        workspaceId: data.workspaceId || 'demo-workspace',
        userId: data.userId || 'demo-user',
      },
    })
    return NextResponse.json(contract, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create contract' }, { status: 500 })
  }
}
