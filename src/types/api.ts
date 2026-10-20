import type { Activity, Client, Contract, Invoice, Project, Proposal, Task } from '@prisma/client'

// API routes return JSON, so Prisma Date fields arrive as ISO strings.
export type Jsonify<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K] extends Date | null ? string | null : T[K]
}

export type ClientDetail = Jsonify<Client> & {
  projects?: (Jsonify<Project> & { tasks?: Jsonify<Task>[] })[]
  invoices?: Jsonify<Invoice>[]
  proposals?: Jsonify<Proposal>[]
  contracts?: Jsonify<Contract>[]
  activities?: Jsonify<Activity>[]
  _count?: { projects?: number }
}
