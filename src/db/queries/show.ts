import { sql } from 'bun'

import type { showCreateType, showResultQueryType } from '@app-types/show'

export const insertShow = async (showData: showCreateType) => {
  const { name, poster, apiId, ended } = showData

  const result = await sql`
      INSERT INTO shows (name, poster, "apiId", ended) 
      VALUES (${name}, ${poster}, ${apiId}, ${ended}) RETURNING id;
    `

  const show = result[0] as { id: string }

  return show
}

export const insertFollowedShow = async (userId: string, showId: string) => {
  await sql`
    INSERT INTO "followedShows" ("userId", "showId") 
    VALUES (${userId}, ${showId});
  `
}

export const getShowByApiId = async (apiId: number) => {
  const result = await sql`
      SELECT id, name, poster, ended, "apiId" 
      FROM shows 
      WHERE "apiId" = ${apiId} 
      LIMIT 1;
    `

  const user = result[0] as showResultQueryType

  return user
}

export const getFollowedShowByUserIdAndShowId = async (
  userId: string,
  showId: string
) => {
  const result = await sql`
    SELECT "userId", "showId"
    FROM "followedShows"
    WHERE "userId" = ${userId} AND "showId" = ${showId}
    LIMIT 1;
  `
  const followedShow = result[0] as { userId: string; showId: string }

  return followedShow
}
