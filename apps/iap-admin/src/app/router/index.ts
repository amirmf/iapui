import { createAppQueryClient } from '@shared/query/query-client'
import { createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'

export const queryClient = createAppQueryClient({
  onUnauthorized: (callbackUrl) => {
    void router.navigate({
      replace: true,
      search: { callbackUrl },
      to: '/login/',
    })
  },
})

export const router = createRouter({
  context: { queryClient },
  defaultPreload: false,
  defaultPreloadStaleTime: 0,
  routeTree,
  trailingSlash: 'always',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
