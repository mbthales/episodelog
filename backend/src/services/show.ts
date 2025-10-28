import { showsApiUrl } from '@config'
import {
  getFollowedShowByUserIdAndShowId,
  getShowByApiId,
  insertFollowedShow,
  insertShow,
} from '@db/queries/show'
import { ExternalApiError } from '@errors/customErrors'
import { getShowsApiToken } from '@utils/showApi'

import type { showApiType, showCreateType } from '@app-types/show'

export const followShow = async (userId: string, showData: showCreateType) => {
  const existingShow = await getShowByApiId(showData.apiId)

  let showId: string

  if (existingShow) {
    showId = existingShow.id
  } else {
    const newShow = await insertShow(showData)
    showId = newShow.id
  }

  await insertFollowedShow(userId, showId)
}

export const searchShow = async (name: string, userId: string) => {
  const token = await getShowsApiToken()
  const response = await fetch(
    `${showsApiUrl}/search?query=${encodeURIComponent(name)}&type=series`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new ExternalApiError('Failed to fetch TV shows')
  }

  const { data } = (await response.json()) as showApiType

  const showsSanitized = data
    .filter((item) => item.status !== 'Ended')
    .map(async (item) => {
      const idSanitized = Number(item.id?.match(/\d+/)?.[0])

      return {
        id: idSanitized,
        name: item.name,
        premiered: item.first_air_time,
        poster: item.image_url,
        country: item.country,
        followed: Boolean(
          await getFollowedShowByUserIdAndShowId(userId, idSanitized)
        ),
      }
    })

  return await Promise.all(showsSanitized)
}
