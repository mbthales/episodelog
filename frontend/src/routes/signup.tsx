import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { signup } from '../queries/auth'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import type { ErrorResponse } from '../types'
import type { AnyFieldApi } from '@tanstack/react-form'

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
})

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(', ')}</em>
      ) : null}
    </>
  )
}

function RouteComponent() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { mutate: createAccount } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      setSuccess('Account created successfully')
    },
    onError: (error: ErrorResponse) => {
      setError(error.response.data.details)
    },
  })

  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      repeatedPassword: '',
    },
    onSubmit: async ({ value }) => {
      if (value.password !== value.repeatedPassword) {
        setError('Passwords do not match')
        return
      }

      createAccount(value)
    },
  })


  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <div>
        <form.Field
          name="username"
          validators={{
            onSubmit: ({ value }) =>
              !value
                ? 'A username is required'
                : value.length > 10
                  ? 'A username must be at most 10 characters'
                  : undefined,
          }}
          children={(field) => {
            return (
              <>
                <label htmlFor={field.name}>Username:</label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    if (error) setError(null)
                    field.handleChange(e.target.value)
                  }}
                />
                <FieldInfo field={field} />
              </>
            )
          }}
        />
      </div>
      <div>
        <form.Field
          name="email"
          validators={{
            onSubmit: ({ value }) =>
              !value
                ? 'A email is required'
                : undefined,
          }}
          children={(field) => {
            return (
              <>
                <label htmlFor={field.name}>Email:</label>
                <input
                  type="email"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    if (error) setError(null)
                    field.handleChange(e.target.value)
                  }}
                />
                <FieldInfo field={field} />
              </>
            )
          }}
        />
      </div>
      <div>
        <form.Field
          name="password"
          validators={{
            onSubmit: ({ value }) =>
              !value
                ? 'A password is required'
                : undefined
          }}
          children={(field) => {
            return (
              <>
                <label htmlFor={field.name}>Password:</label>
                <input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    if (error) setError(null)
                    field.handleChange(e.target.value)
                  }}
                />
                <FieldInfo field={field} />
              </>
            )
          }}
        />
      </div>
      <div>
        <form.Field
          name="repeatedPassword"
          validators={{
            onSubmit: ({ value }) =>
              !value
                ? 'A password is required'
                : undefined
          }}
          children={(field) => {
            return (
              <>
                <label htmlFor={field.name}>Password:</label>
                <input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    if (error) setError(null)
                    field.handleChange(e.target.value)
                  }}
                />
                <FieldInfo field={field} />
              </>
            )
          }}
        />
      </div>
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? '...' : 'Submit'}
          </button>
        )}
      />
      <p>Already have a accounts?</p>
      <Link to="/signin">Sign in</Link>
      <span>
        {error ? (
          <div>
            <p>{error}</p>
          </div>
        ) : null}
        {success ? (
          <div>
            <p>{success}</p>
          </div>
        ) : null}
      </span>
    </form>
  )
}
