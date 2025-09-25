import { z } from 'zod'

export const showCreateSchema = z.object({
  name: z.string().min(1).max(50),
  poster: z.url().optional(),
  apiId: z.number().int(),
  ended: z.boolean(),
})
