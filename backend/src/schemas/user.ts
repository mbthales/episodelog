import { z } from 'zod'

export const userCreateSchema = z.object({
  username: z.string().min(3).max(15),
  email: z.email(),
  password: z.string().min(8),
})

export const userLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
})
