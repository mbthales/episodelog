import { sql } from 'bun'

const createDatabases = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid (),
        "username" varchar(15) NOT NULL UNIQUE,
        "password" text NOT NULL,
        "email" text NOT NULL UNIQUE,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
    );
  `

  await sql`
    CREATE TABLE IF NOT EXISTS "shows" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid (),
        "name" varchar(50) NOT NULL,
        "poster" text,
        "apiId" integer NOT NULL UNIQUE,
        "ended" boolean NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
    );
  `

  await sql`
    CREATE TABLE IF NOT EXISTS "followedShows" (
        "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "showId" uuid NOT NULL REFERENCES "shows"("id") ON DELETE CASCADE,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY ("userId", "showId")
    );
  `
}

createDatabases()
