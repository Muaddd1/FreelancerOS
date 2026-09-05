import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { slugify } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    const { name, email, password, workspace: workspaceName } = await req.json()

    if (!name || !email || !password || !workspaceName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 400 })

    const slug = slugify(workspaceName)

    const result = await prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: workspaceName,
          slug,
          currency: 'USD',
          hourlyRate: 75,
        },
      })

      const user = await tx.user.create({
        data: {
          name,
          email,
          password,
          workspace: {
            create: {
              workspaceId: workspace.id,
              role: 'OWNER',
            },
          },
        },
      })

      return { user, workspace }
    })

    return NextResponse.json({ success: true, userId: result.user.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
