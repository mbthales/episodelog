import { z } from 'zod'

import { showCreateSchema } from '@schemas/show'

export type showType = {
  id: string
  name: string
  poster: string | null
  apiId: number
  country: string
  createdAt: Date
  updatedAt: Date
}

export type followedShowType = {
  userId: string
  showId: string
  createdAt: Date
}

export type showApiType = {
  data: {
    id: string
    name: string
    image_url: string
    status: string
    first_air_time: string
    country: string
  }[]
}

export type showCreateType = z.infer<typeof showCreateSchema>

export type showResultQueryType = Pick<
  showType,
  'id' | 'name' | 'poster' | 'apiId' | 'country'
>
