import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const messages = await prisma.message.findMany({
    include: { client: true, project: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return NextResponse.json(messages)
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const message = await prisma.message.create({
      data: {
        ...data,
        workspaceId: data.workspaceId || 'demo-workspace',
        userId: data.userId || 'demo-user',
      },
    })
    return NextResponse.json(message, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
