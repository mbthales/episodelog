import { Hono } from 'hono'

import { getAllFollowedShowsByUser } from '@db/queries/show'
import authUser from '@middlewares/auth'
import validator from '@middlewares/validator'
import { showCreateSchema } from '@schemas/show'
import { followShow } from '@services/show'

const app = new Hono()

app.post('/:id/show', authUser, validator(showCreateSchema), async (c) => {
  const userId = c.req.param('id')
  const body = c.req.valid('json')

  await followShow(userId, body)

  return c.json({
    message: 'Show followed successfully',
  })
})

app.get('/:id/show', authUser, async (c) => {
  const userId = c.req.param('id')

  const followedShows = await getAllFollowedShowsByUser(userId)

  return c.json({
    data: followedShows,
  })
})

export default app
