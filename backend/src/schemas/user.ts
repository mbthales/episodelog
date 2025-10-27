import { z } from 'zod'

export const userCreateSchema = z.object({
  username: z.string().min(3).max(15).regex(
    /^[a-zA-Z_]+$/,
    'Username must contain only letters and underscores'
  ),
  email: z.email().toLowerCase().max(255),
  password: z.string().min(8).max(100),
})

export const userLoginSchema = z.object({
  username: z.string().trim().max(15),
  password: z.string().max(100),
})
