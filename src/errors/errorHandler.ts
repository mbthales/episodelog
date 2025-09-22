import { SQL } from 'bun'
import { HTTPException } from 'hono/http-exception'

import { AuthError } from '@errors/customErrors'

import type { Context } from 'hono'

const errorHandler = (error: Error, c: Context) => {
  if (error instanceof SQL.PostgresError) {
    const code = error.errno

    if (code === '23505') {
      return c.json(
        {
          message: 'User already exists',
        },
        409
      )
    }
  }

  if (
    error instanceof AuthError ||
    (error instanceof HTTPException && error.status === 401)
  ) {
    return c.json(
      {
        message: error.message || 'Unauthorized',
      },
      401
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
