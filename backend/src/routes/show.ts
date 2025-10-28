import { Hono } from 'hono'

import authUser from '@middlewares/auth'
import { searchShow } from '@services/show'

const app = new Hono<{ Variables: { userId: string } }>()

app.get('/search/:name', authUser, async (c) => {
  const { name } = c.req.param()
  const userId = c.get('userId')

  const shows = await searchShow(name, userId)

  return c.json({
    data: shows,
  })
})

export default app
