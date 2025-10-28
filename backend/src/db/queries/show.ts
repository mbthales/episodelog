import { SQL, sql } from 'bun'

import { ConflictError } from '@errors/customErrors'

import type { showCreateType, showResultQueryType } from '@app-types/show'

export const insertShow = async (showData: showCreateType) => {
  const { name, poster, apiId, country } = showData

  const result = await sql`
      INSERT INTO shows (name, poster, api_id, country) 
      VALUES (${name}, ${poster}, ${apiId}, ${country}) RETURNING id;
    `

  const show = result[0] as { id: string }

  return show
}

export const insertFollowedShow = async (userId: string, showId: string) => {
  try {
    await sql`
      INSERT INTO followed_shows (user_Id, show_Id) 
      VALUES (${userId}, ${showId});
    `
  } catch (error) {
    if (error instanceof SQL.PostgresError) {
      if (error.errno && error.errno === '23505') {
        throw new ConflictError('User already follows the show')
      }
    }
  }
}

export const deleteFollowedShow = async (userId: string, showApiId: number) => {
  await sql`
    DELETE FROM followed_shows
    USING shows
    WHERE followed_shows.show_id = shows.id
    AND followed_shows.user_id = ${userId}
    AND shows.api_id = ${showApiId};
  `
}

export const getShowByApiId = async (apiId: number) => {
  const result = await sql`
      SELECT id, name, poster, api_id, country
      FROM shows 
      WHERE api_id = ${apiId} 
      LIMIT 1;
    `

  const user = result[0] as showResultQueryType

  return user
}

export const getAllFollowedShowsByUser = async (userId: string) => {
  const result = await sql`
    SELECT id, name, poster, api_id, country
    FROM shows
    JOIN followed_shows
    ON shows.id = followed_shows.show_id
    WHERE followed_shows.user_id = ${userId};
  `

  return result as showResultQueryType[]
}

export const getFollowedShowByUserIdAndShowId = async (
  userId: string,
  showApiId: number
) => {
  const result = await sql`
    SELECT followed_shows.show_id AS id
    FROM followed_shows
    JOIN shows ON shows.id = followed_shows.show_id
    WHERE followed_shows.user_id = ${userId}
    AND shows.api_id = ${showApiId}
    LIMIT 1;
  `

  const followedShowId = result[0] as { id: string } | undefined

  return followedShowId
}
