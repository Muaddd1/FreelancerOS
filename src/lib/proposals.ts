// Proposal forms post flat JSON; Prisma needs known columns, Dates and nested item writes.
type ItemInput = { name?: string; description?: string; quantity?: number | string; price?: number | string }

const optionalId = (v: unknown) => (v === undefined ? undefined : (v as string) || null)
const optionalDate = (v: unknown) => (v === undefined ? undefined : v ? new Date(v as string) : null)

export function proposalFields(body: Record<string, unknown>) {
  return {
    name: body.name as string | undefined,
    content: body.content as string | undefined,
    status: body.status as string | undefined,
    total: body.total === undefined ? undefined : Number(body.total) || 0,
    clientId: optionalId(body.clientId),
    projectId: optionalId(body.projectId),
    sentAt: optionalDate(body.sentAt),
    expiresAt: optionalDate(body.expiresAt),
  }
}

export function proposalItems(items: unknown) {
  if (!Array.isArray(items)) return undefined
  return (items as ItemInput[])
    .filter(i => i.name || i.description)
    .map(i => ({
      name: i.name || i.description || 'Item',
      description: i.description || null,
      quantity: Number(i.quantity) || 1,
      price: Number(i.price) || 0,
    }))
}
