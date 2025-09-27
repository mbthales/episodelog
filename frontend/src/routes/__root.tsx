import { useAuthStore } from '@/stores/auth'
import { createRootRoute, Link, Outlet, redirect } from '@tanstack/react-router'

const RootLayout = () => (
  <>
    <div className="p-2 flex gap-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{' '}
    </div>
    <hr />
    <Outlet />
  </>
)

export const Route = createRootRoute({
  component: RootLayout,
  beforeLoad: async ({ location }) => {
    const authRoutes = ['/about']
    const pathname = location.pathname

    if (authRoutes.includes(pathname)) {
      const { accessToken } = useAuthStore.getState()

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
