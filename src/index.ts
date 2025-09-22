import { Hono } from 'hono'
import { logger } from 'hono/logger'

import errorHandler from '@errors/errorHandler'
import authUser from '@middlewares/auth'
import validator from '@middlewares/validator'
import { userCreateSchema, userLoginSchema } from '@schemas/user'
import { createUserService, loginUserService } from '@services/user'

const app = new Hono()

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

  const token = await loginUserService(body)

  c.header('Authorization', token)

  return c.json(
    {
      message: 'User logged in succefully',
    },
    200
  )
})

app.get('/user/:id', authUser, async (c) => {
  return c.json({
    message: 'hello',
  })
})

export default {
  port: 3000,
  fetch: app.fetch,
}
