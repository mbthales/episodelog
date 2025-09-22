import { z } from 'zod'

import { userCreateSchema, userLoginSchema } from '@schemas/user'

export type userType = {
  id: string
  username: string
  password: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export type userCreateType = z.infer<typeof userCreateSchema>

export type userLoginType = z.infer<typeof userLoginSchema>

export type userQueryResultType = Pick<userType, 'id' | 'username' | 'password'>
