import { z } from 'zod'

import { showCreateSchema } from '@schemas/show'

export type showType = {
  id: string
  name: string
  poster: string | null
  apiId: number
  ended: boolean
  createdAt: Date
  updatedAt: Date
}

export type followedShowType = {
  userId: string
  showId: string
  createdAt: Date
}

export type showCreateType = z.infer<typeof showCreateSchema>

export type showResultQueryType = Pick<
  showType,
  'id' | 'name' | 'poster' | 'apiId' | 'ended'
>
