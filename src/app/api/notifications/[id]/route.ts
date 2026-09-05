import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json()
    await prisma.notification.update({ where: { id: params.id }, data })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
  }
}
