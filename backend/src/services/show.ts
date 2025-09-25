import {
  getFollowedShowByUserIdAndShowId,
  getShowByApiId,
  insertFollowedShow,
  insertShow,
} from '@db/queries/show'
import { ConflictError } from '@errors/customErrors'

import type { showCreateType } from '@app-types/show'

export const followShow = async (userId: string, showData: showCreateType) => {
  const existingShow = await getShowByApiId(showData.apiId)

  let showId: string

  if (existingShow) {
    showId = existingShow.id
  } else {
    const newShow = await insertShow(showData)
    showId = newShow.id
  }

  const existingFollowedShow = await getFollowedShowByUserIdAndShowId(
    userId,
    showId
  )

  if (existingFollowedShow) {
    throw new ConflictError('You already follows the show')
  }

  await insertFollowedShow(userId, showId)
}
