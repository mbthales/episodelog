import { useAuthStore } from '@/stores/auth'
import type { followShowType } from '@/types/show'

export const unfollowShow = async (showId: number) => {
  const { accessToken } = useAuthStore.getState()
  const url = `http://localhost:3000/user/shows/${showId}`

  const req = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken || ''}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!req.ok) {
    const error = (await req.json()) as { message: string }

    throw new Error(error.message)
  }

  return (await req.json()) as {
    message: string
  }
}

export const followShow = async (showData: followShowType) => { 
  const { accessToken } = useAuthStore.getState()
  const url = `http://localhost:3000/user/shows`

  const req = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken || ''}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(showData),
    credentials: 'include',
  })

  if (!req.ok) {
    const error = (await req.json()) as { message: string }

    throw new Error(error.message)
  }

  return (await req.json()) as {
    message: string
  }
}

export const getUserShows = async () => {
  const { accessToken } = useAuthStore.getState()
  const url = `http://localhost:3000/user/shows`

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
    }[]
  }
}
