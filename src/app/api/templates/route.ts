import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const templates = await prisma.template.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(templates)
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const template = await prisma.template.create({
      data: {
        ...data,
        workspaceId: data.workspaceId || 'demo-workspace',
        userId: data.userId || 'demo-user',
      },
    })
    return NextResponse.json(template, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
  }
}
