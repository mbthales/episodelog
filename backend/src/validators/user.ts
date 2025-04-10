import { users, shows } from '../db/schema'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

export const insertUserShowSchema = createInsertSchema(shows)
export const signupSchema = createInsertSchema(users)
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    username: z.string().max(10),
    email: z.string().email(),
  })
export const signinSchema = createInsertSchema(users)
  .omit({
    createdAt: true,
    updatedAt: true,
    email: true,
  })
  .extend({
    username: z.string().max(10),
  })
