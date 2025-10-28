import { SQL, sql } from 'bun'

import { ConflictError } from '@errors/customErrors'

import type { userCreateType, userQueryResultType } from '@app-types/user'

export const insertUser = async (user: userCreateType) => {
  const { username, password: hashedPassword, email } = user

  try {
    await sql`
      INSERT INTO users (username, password, email) 
      VALUES (${username}, ${hashedPassword}, ${email});`
  } catch (error) {
    if (error instanceof SQL.PostgresError) {
      if (error.errno && error.errno === '23505') {
        throw new ConflictError('User or email already exists')
      }
    }
  }
}

export const getUserByUsername = async (username: string) => {
  const result = await sql`
      SELECT id, username, password 
      FROM users 
      WHERE username = ${username} 
      LIMIT 1;
    `

  const user = result[0] as userQueryResultType

  return user
}
