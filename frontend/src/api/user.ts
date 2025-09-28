import { useAuthStore } from '@/stores/auth'

export const getUserShows = async (userId: string) => {
  const { accessToken } = useAuthStore.getState()
  const url = `http://localhost:3000/user/${userId}/show`

  const req = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken} || ''}`,
    },
    credentials: 'include',
  })

  if (!req.ok) {
    const error = (await req.json()) as { message: string }

    throw new Error(error.message)
  }

  return (await req.json()) as {
    data: {
      id: string
      name: string
      poster: string | null
      apiId: number
      ended: boolean
    }[]
  }
}
