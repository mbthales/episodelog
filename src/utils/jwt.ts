import { jwtVerify, SignJWT } from 'jose'

import { secretJWT } from '@config'
import { AuthError } from '@errors/customErrors'

import type { jwtPayloadType } from '@app-types/jwt'

export const generateToken = async (
  payload: jwtPayloadType,
  expirationTime: string
) => {
  const secret = new TextEncoder().encode(secretJWT)
  const alg = 'HS256'

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(secret)

  return jwt
}

export const verifyToken = async (token: string) => {
  try {
    const secret = new TextEncoder().encode(secretJWT)
    const verified = await jwtVerify(token, secret)

    return verified
  } catch {
    throw new AuthError('Invalid token')
  }
}
