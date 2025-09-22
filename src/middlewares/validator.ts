import { zValidator } from '@hono/zod-validator'

import type { ZodType } from 'zod'

const validate = <T extends ZodType>(validator: T) => {
  return zValidator('json', validator, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          message: 'Invalid request',
          errors: result.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        400
      )
    }
  })
}

export default validate
