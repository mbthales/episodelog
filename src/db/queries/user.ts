import { sql } from 'bun'

import type { userCreateType, userQueryResultType } from '@app-types/user'

export const insertUser = async (user: userCreateType) => {
  const { username, password: hashedPassword, email } = user

  await sql`
    INSERT INTO users (username, password, email) 
    VALUES (${username}, ${hashedPassword}, ${email});`
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
