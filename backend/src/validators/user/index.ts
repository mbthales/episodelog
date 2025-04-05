import { userShowsTable } from '../../db/schema'
import { createInsertSchema } from 'drizzle-zod'

export const insertUserShowSchema = createInsertSchema(userShowsTable)
