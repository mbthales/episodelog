import { password } from 'bun'

import { accessTokenTime, refreshTokenTime } from '@config'
import { getUserByUsername, insertUser } from '@db/queries/user'
import { AuthError, ConflictError } from '@errors/customErrors'
import { generateToken } from '@utils/jwt'

import type { userCreateType, userLoginType } from '@app-types/user'

export const createUserService = async (userData: userCreateType) => {
  const existingUser = await getUserByUsername(userData.username)

  if (existingUser) {
    throw new ConflictError('User already exists')
  }

  const hashedPassword = await password.hash(userData.password)

  const newUser = {
    username: userData.username,
    password: hashedPassword,
    email: userData.email,
  }

  await insertUser(newUser)
}

export const loginUserService = async (userData: userLoginType) => {
  const user = await getUserByUsername(userData.username)

  if (!user) {
    throw new AuthError('Invalid username or password')
  }

  const isValidPassword = await password.verify(
    userData.password,
    user.password
  )

  if (!isValidPassword) {
    throw new AuthError('Invalid username or password')
  }

  const jwtPayload = {
    userId: user.id,
    username: user.username,
  }

  const accessToken = await generateToken(jwtPayload, accessTokenTime)
  const refreshToken = await generateToken(jwtPayload, refreshTokenTime)

  return { accessToken, refreshToken }
}
