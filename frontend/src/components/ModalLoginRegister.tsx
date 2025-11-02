import { z } from 'zod'

import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

const { fieldContext, formContext } = createFormHookContexts()

function SubmitButton() {
  return (
    <button
      type="submit"
      className="bg-accent-600 text-font-900 py-4 px-6 mt-8"
    >
      Login
    </button>
  )
}

function TextField({ label, type }: { label: string; type?: string }) {
  return (
    <input
      placeholder={label}
      type={type}
      className="border-2 border-accent-600 bg-transparent text-font-900 py-2 px-4 rounded mb-2"
    />
  )
}

const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
})

export function ModalLoginRegister() {
  const form = useAppForm({
    defaultValues: {
      username: '',
      password: '',
    },
    validators: {
      onChange: z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      }),
    },
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value, null, 2))
    },
  })

  return (
    <div className="fixed inset-0 bg-black/75">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-600 p-6 rounded shadow-md flex flex-col"
      >
        <form.AppField
          name="username"
          children={(field) => <field.TextField label="Full Name" />}
        />
        <form.AppField
          name="password"
          children={(field) => (
            <field.TextField label="Password" type="password" />
          )}
        />
        <form.AppForm>
          <form.SubmitButton />
        </form.AppForm>
      </form>
    </div>
  )
}
