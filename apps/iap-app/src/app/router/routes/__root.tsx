import type { AuthSession } from '@iap/auth'
import { Toaster } from '@iap/ui'
import {
  GeneralRouteError,
  NotFoundRouteError,
} from '@shared/router/route-errors'
import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export type RouterContext = {
  auth: Pick<AuthSession, 'isAuthenticated' | 'isLoading' | 'user'>
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      <Toaster duration={5000} position='top-center' />
      {import.meta.env.DEV && (
        <>
          <ReactQueryDevtools buttonPosition='bottom-left' />
          <TanStackRouterDevtools position='bottom-right' />
        </>
      )}
    </>
  ),
  errorComponent: GeneralRouteError,
  notFoundComponent: NotFoundRouteError,
})
