import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const files = await prisma.file.findMany({
    include: { client: true, project: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(files)
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const file = await prisma.file.create({
      data: {
        ...data,
        workspaceId: data.workspaceId || 'demo-workspace',
        userId: data.userId || 'demo-user',
      },
    })
    return NextResponse.json(file, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
