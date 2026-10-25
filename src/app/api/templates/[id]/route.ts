import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.template.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
