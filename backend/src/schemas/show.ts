import { z } from 'zod'

export const showCreateSchema = z.object({
  name: z.string().trim().min(1).max(50),
  poster: z.url().max(2048).optional(),
  apiId: z.number().int().positive(),
  country: z.string().trim().min(1).max(10),
})
