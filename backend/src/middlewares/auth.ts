import { createMiddleware } from 'hono/factory'

import { AuthError } from '@errors/customErrors'
import { verifyToken } from '@utils/jwt'

import type { jwtPayloadType } from '@app-types/jwt'

const authUser = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthError('Invalid authorization header')
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    throw new AuthError('Invalid Token')
  }

  const validatedToken = await verifyToken(token)
  const tokenPayload = validatedToken.payload as jwtPayloadType

  c.set('userId', tokenPayload.userId)

  await next()
})

export default authUser
