import { create } from 'zustand'

type State = {
  accessToken: string | null
  username: string | null
}

type Action = {
  updateAccessToken: (accessToken: State['accessToken']) => void
  updateUsername: (username: State['username']) => void
}

export const useAuthStore = create<State & Action>((set) => ({
  accessToken: null,
  username: null,
  updateAccessToken: (accessToken) => set(() => ({ accessToken })),
  updateUsername: (username) => set(() => ({ username })),
}))
