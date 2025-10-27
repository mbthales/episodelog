import { Hono } from 'hono'
import { searchShow } from '@services/show'

const app = new Hono()

app.get('/search/:name', async (c) => {
  const { name } = c.req.param()

  const shows = await searchShow(name)

  return c.json({
    data: shows,
  })
})

export default app