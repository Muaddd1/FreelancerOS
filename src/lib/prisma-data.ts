import { Prisma } from '@prisma/client'

const skip = new Set(['id', 'workspaceId', 'userId', 'createdAt', 'updatedAt'])

// Form bodies are flat JSON from <input>s: keep only real scalar columns of the
// model, turn '' into null for optional fields and date/number strings into values.
// Returns any on purpose: the keys are only known at runtime, and Prisma still validates them.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toData(model: Prisma.ModelName, body: Record<string, unknown>): any {
  const fields = Prisma.dmmf.datamodel.models.find(m => m.name === model)!.fields
  const data: Record<string, unknown> = {}
  for (const f of fields) {
    if (f.kind !== 'scalar' || skip.has(f.name) || body[f.name] === undefined) continue
    let v = body[f.name]
    if (v === '' && !f.isRequired) v = null
    else if (f.type === 'DateTime' && typeof v === 'string') v = new Date(v)
    else if ((f.type === 'Float' || f.type === 'Int') && typeof v === 'string') v = Number(v) || 0
    data[f.name] = v
  }
  return data
}
