import { Hono } from 'hono'

import { getAllFollowedShowsByUser } from '@db/queries/show'
import authUser from '@middlewares/auth'
import validator from '@middlewares/validator'
import { showCreateSchema } from '@schemas/show'
import { followShow } from '@services/show'

const app = new Hono<{ Variables: { userId: string } }>()

app.post('/shows', authUser, validator(showCreateSchema), async (c) => {
  const userId = c.get('userId')
  const body = c.req.valid('json')

  await followShow(userId, body)

  return c.json({
    message: 'Show followed successfully',
  })
})

app.get('/shows', authUser, async (c) => {
  const userId = c.get('userId')

  const followedShows = await getAllFollowedShowsByUser(userId)

  return c.json({
    data: followedShows,
  })
})

export default app
