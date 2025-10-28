import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { originUrl, port } from '@config'
import errorHandler from '@errors/errorHandler'
import auth from '@routes/auth'
import show from '@routes/show'
import user from '@routes/user'

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

app.route('/auth', auth)
app.route('/user', user)
app.route('/show', show)

export default {
  port,
  fetch: app.fetch,
}
