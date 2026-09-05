import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const WEBHOOK_SECRET = process.env.GUMROAD_WEBHOOK_SECRET

function verifySignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return true // skip in dev
  const crypto = require('crypto')
  const expected = crypto.createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex')
  return expected === signature
}

export async function POST(req: Request) {
  const payload = await req.text()
  const signature = req.headers.get('x-gumroad-signature') || ''

  if (!verifySignature(payload, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const data = JSON.parse(payload)
  const { email, name, product_name, product_permalink } = data

  if (!email) {
    return NextResponse.json({ error: 'No email' }, { status: 400 })
  }

  // Determine what product they bought and set password
  const isMembership = product_permalink?.includes('FreelancerOS')
  const isSourceCode = product_permalink?.includes('Freelancer')

  const randomPassword = Math.random().toString(36).slice(-8)
  const workspaceName = name ? name.replace(/\s+/g, '').toLowerCase() : email.split('@')[0]

  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      // Send login info even if existing
      await sendLoginEmail(email, randomPassword, isMembership, isSourceCode)
      return NextResponse.json({ ok: true, message: 'User already exists' })
    }

    // Create workspace
    const workspace = await prisma.workspace.create({
      data: {
        name: workspaceName || 'My Workspace',
        slug: workspaceName?.toLowerCase() || email.split('@')[0],
        currency: 'USD',
        hourlyRate: 75,
      },
    })

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name || 'User',
        email,
        password: randomPassword,
        role: 'ADMIN',
        workspace: {
          create: {
            workspaceId: workspace.id,
            role: 'OWNER',
          },
        },
      },
    })

    // Send welcome email with login credentials
    await sendLoginEmail(email, randomPassword, isMembership, isSourceCode)

    return NextResponse.json({ ok: true, userId: user.id })
  } catch (err: any) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

async function sendLoginEmail(email: string, password: string, isMembership: boolean, isSourceCode: boolean) {
  if (!process.env.RESEND_API_KEY) return

  const product = isMembership ? 'Freelancer OS (Monthly Membership)' : isSourceCode ? 'Freelancer OS (Source Code)' : 'Freelancer OS'
  const loginUrl = 'https://freelancer-os-gamma.vercel.app/login'

  await resend.emails.send({
    from: 'Freelancer OS <onboarding@resend.dev>',
    to: email,
    subject: `Your ${product} Access`,
    html: `
      <h2>Welcome to Freelancer OS!</h2>
      <p>Your purchase of <strong>${product}</strong> has been confirmed.</p>
      <p><strong>Your login credentials:</strong></p>
      <p>Email: <code>${email}</code><br>Password: <code>${password}</code></p>
      <p><a href="${loginUrl}">Click here to log in</a></p>
      <p>We recommend changing your password after your first login.</p>
      <p>Questions? Reply to this email.</p>
      <br>
      <p>Best,<br>The Freelancer OS Team</p>
    `,
  })
}
