export const loginUser = async (credentials: {
  username: string
  password: string
}) => {
  const url = 'http://localhost:3000/auth/login'

  const req = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  })

  if (!req.ok) {
    const error = (await req.json()) as { message: string }

    throw new Error(error.message)
  }

  return (await req.json()) as { message: string; accessToken: string }
}

export const refreshAccessToken = async () => {
  const url = 'http://localhost:3000/auth/refresh'

  const req = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  return (await req.json()) as { message: string; accessToken: string }
}
