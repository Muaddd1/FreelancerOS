import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
  return NextResponse.json(notifications)
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const notification = await prisma.notification.create({
      data: {
        ...data,
        workspaceId: data.workspaceId || 'demo-workspace',
        userId: data.userId || 'demo-user',
      },
    })
    return NextResponse.json(notification, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}
