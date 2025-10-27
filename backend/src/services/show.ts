import {
  getShowByApiId,
  insertFollowedShow,
  insertShow,
} from '@db/queries/show'
import { ExternalApiError } from '@errors/customErrors'
import { showsApiUrl } from '@config'

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

export const searchShow = async (query: string) => {
  const response = await fetch(
    `${showsApiUrl}/search/shows?q=${encodeURIComponent(query)}`
  )

  if (!response.ok) {
    throw new ExternalApiError('Failed to fetch TV shows')
  } 

  const data = await response.json() as showApiType[]
  const showsSanitized = data.map((item) => ({
    id: item.show.id,
    name: item.show.name,
    premiered: item.show.premiered,
    image: item.show.image?.original || null,
  }))

  return showsSanitized
}