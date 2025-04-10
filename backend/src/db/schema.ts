import { relations } from 'drizzle-orm'
import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 10 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: integer().notNull(),
  updatedAt: integer().notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  shows: many(shows),
}))

export const shows = pgTable('userShows', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  apiId: integer().notNull(),
  userId: integer().notNull(),
  createdAt: integer().notNull(),
  updatedAt: integer().notNull(),
})

export const showsRelations = relations(shows, ({ one }) => ({
  user: one(users, {
    fields: [shows.userId],
    references: [users.id],
  }),
}))
