import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { accessTokenTime, originUrl, refreshTokenDays } from '@config'
import { getAllFollowedShowsByUser } from '@db/queries/show'
import errorHandler from '@errors/errorHandler'
import authUser from '@middlewares/auth'
import validator from '@middlewares/validator'
import { showCreateSchema } from '@schemas/show'
import { userCreateSchema, userLoginSchema } from '@schemas/user'
import { followShow } from '@services/show'
import { createUserService, loginUserService } from '@services/user'
import { generateToken, verifyToken } from '@utils/jwt'

import type { jwtPayloadType } from '@app-types/jwt'

const app = new Hono()

app.use(
  cors({
    origin: originUrl,
    allowMethods: ['POST', 'GET', 'DELETE', 'OPTIONS'],
    maxAge: 600,
    credentials: true,
  })
)
app.use(logger())

app.onError(errorHandler)

app.post('/auth/register', validator(userCreateSchema), async (c) => {
  const body = c.req.valid('json')

  await createUserService(body)

  return c.json(
    {
      message: 'User created successfully',
    },
    201
  )
})

app.post('/auth/login', validator(userLoginSchema), async (c) => {
  const body = c.req.valid('json')

  const { accessToken, refreshToken } = await loginUserService(body)

  setCookie(c, 'refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 60 * 60 * 24 * refreshTokenDays,
    path: '/',
  })

  return c.json(
    {
      message: 'User logged in succefully',
      accessToken,
    },
    200
  )
})

app.get('/auth/refresh', async (c) => {
  const refreshToken = getCookie(c, 'refreshToken')

  if (!refreshToken) {
    return c.json(
      {
        message: 'Refresh cookie not found',
      },
      401
    )
  }

  const validatedToken = await verifyToken(refreshToken)
  const tokenPayload = validatedToken.payload as jwtPayloadType

  const newAccessToken = await generateToken(tokenPayload, accessTokenTime)

  return c.json(
    {
      message: 'Access token renewed successfully',
      accessToken: newAccessToken,
    },
    200
  )
})

app.post('/user/:id/show', authUser, validator(showCreateSchema), async (c) => {
  const userId = c.req.param('id')
  const body = c.req.valid('json')

  await followShow(userId, body)

  return c.json({
    message: 'Show followed successfully',
  })
})

app.get('/user/:id/show', authUser, async (c) => {
  const userId = c.req.param('id')

  const followedShows = await getAllFollowedShowsByUser(userId)

  return c.json({
    data: followedShows,
  })
})

export default {
  port: 3000,
  fetch: app.fetch,
}
