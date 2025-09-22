import { password } from 'bun'

import { getUserByUsername, insertUser } from '@db/queries/user'
import { AuthError } from '@errors/customErrors'
import { generateToken } from '@utils/jwt'

import type { userCreateType, userLoginType } from '@app-types/user'

export const createUserService = async (user: userCreateType) => {
  const hashedPassword = await password.hash(user.password)

  const newUser = {
    username: user.password,
    password: hashedPassword,
    email: user.email,
  }

  await insertUser(newUser)
}

export const loginUserService = async (_user: userLoginType) => {
  const user = await getUserByUsername(_user.username)

  if (!user) {
    throw new AuthError('Invalid username or password')
  }

  const isValidPassword = await password.verify(_user.password, user.password)

  if (!isValidPassword) {
    throw new AuthError('Invalid username or password')
  }

  const jwtPayload = {
    userId: user.id,
    username: user.username,
  }

  const token = generateToken(jwtPayload)

  return token
}
