import { refreshAccessToken } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import { createRootRoute, Link, Outlet, redirect } from '@tanstack/react-router'

const RootLayout = () => {
  const { username } = useAuthStore.getState()

  return (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/shows" className="[&.active]:font-bold">
          Shows
        </Link>
        <Link to="/search" className="[&.active]:font-bold">
          Search
        </Link>
      </div>
      <hr />
      <div>
        <h1>HELLO {username}</h1>
      </div>
      <Outlet />
    </>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
  beforeLoad: async ({ location }) => {
    let { accessToken } = useAuthStore.getState()
    const authRoutes = ['/shows']
    const pathname = location.pathname

    if (!accessToken) {
      try {
        const {
          accessToken: newAccessToken,
          username,
          id,
        } = await refreshAccessToken()

        console.log('New Access Token:', newAccessToken)

        useAuthStore.getState().updateAccessToken(newAccessToken)
        useAuthStore.getState().updateUsername(username)
        useAuthStore.getState().updateUserId(id)

        accessToken = newAccessToken
      } catch {
        console.error('Failed to refresh access token')
      }
    }

    if (authRoutes.includes(pathname)) {
      if (!accessToken) {
        throw redirect({
          to: '/login',
          search: {
            redirect: pathname,
          },
        })
      }
    }
  },
})
