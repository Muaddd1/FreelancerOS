// Proposal forms post flat JSON; Prisma needs known columns, Dates and nested item writes.
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
