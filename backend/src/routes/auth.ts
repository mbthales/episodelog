import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'

import { accessTokenTime, refreshTokenDays } from '@config'
import validator from '@middlewares/validator'
import { userCreateSchema, userLoginSchema } from '@schemas/user'
import { createUserService, loginUserService } from '@services/user'
import { generateToken, verifyToken } from '@utils/jwt'

import type { jwtPayloadType } from '@app-types/jwt'

const app = new Hono()

app.post('/register', validator(userCreateSchema), async (c) => {
  const body = c.req.valid('json')

  await createUserService(body)

  return c.json(
    {
      message: 'User created successfully',
    },
    201
  )
})

app.post('/login', validator(userLoginSchema), async (c) => {
  const body = c.req.valid('json')

  const { accessToken, refreshToken } = await loginUserService(body)

  setCookie(c, 'refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
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

app.get('/refresh', async (c) => {
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

export default app
