import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const userShowsTable = pgTable("userShows", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    showId: integer().notNull()
});