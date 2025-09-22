import { AuthError, ConflictError } from '@errors/customErrors'

import type { Context } from 'hono'

const errorHandler = (error: Error, c: Context) => {
  console.log('ERROR', error)

  if (error instanceof AuthError) {
    return c.json(
      {
        message: error.message,
      },
      401
    )
  }

  if (error instanceof ConflictError) {
    return c.json(
      {
        message: error.message,
      },
      409
    )
  }

  return c.json(
    {
      message: 'Internal server error',
    },
    500
  )
}

export default errorHandler
