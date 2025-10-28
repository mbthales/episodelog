import { useAuthStore } from '@/stores/auth'

export const searchShows = async (showName: string) => {
  const { accessToken } = useAuthStore.getState()
  const url = `http://localhost:3000/show/search/${encodeURIComponent(showName)}`

  const req = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken || ''}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!req.ok) {
    const error = (await req.json()) as { message: string }

    throw new Error(error.message)
  }

  return (await req.json()) as {
    data: {
      id: number
      name: string
      poster: string | null
      premiered: string
      country: string
      followed: boolean
    }[]
  }
}
