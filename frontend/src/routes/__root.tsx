import { refreshAccessToken } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import {
  createRootRoute,
  Link,
  Outlet,
  redirect,
  useRouterState,
} from '@tanstack/react-router'

const RootLayout = () => {
  const location = useRouterState({ select: (s) => s.location })
  const isHome = location.pathname === '/'

  return (
    <div>
      {!isHome && (
        <div className="p-2 flex gap-2 justify-center items-center mb-4 h-16">
          <Link to="/shows" className="[&.active]:font-bold">
            Shows
          </Link>
          <Link to="/search" className="[&.active]:font-bold">
            Search
          </Link>
        </div>
      )}
      <Outlet />
    </div>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
  beforeLoad: async ({ location }) => {
    let { accessToken } = useAuthStore.getState()

    const authRoutes = ['/shows', '/search']
    const pathname = location.pathname

    if (!accessToken) {
      try {
        const {
          accessToken: newAccessToken,
          username,
          id,
        } = await refreshAccessToken()

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
        throw redirect({ to: '/' })
      }
    } else if (pathname === '/') {
      if (accessToken) {
        throw redirect({ to: '/shows' })
      }
    }
  },
})
