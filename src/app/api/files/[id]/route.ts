import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Removes the file record only; `url` points at external storage, which this app doesn't manage.
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.file.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
