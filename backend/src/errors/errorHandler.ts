import { AuthError, ConflictError, ExternalApiError } from '@errors/customErrors'

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

  if (error instanceof ExternalApiError) {
    return c.json(
      {
        message: error.message,
      },
      502
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
