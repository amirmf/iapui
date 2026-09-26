import { useEffect, useRef } from 'react'

import { router } from '@app/router'
import { useAuthSession } from '@iap/auth'
import { RouterProvider } from '@tanstack/react-router'

export function AuthenticatedRouterProvider() {
  const auth = useAuthSession()
  const hasMounted = useRef(false)

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }

    void router.invalidate()
  }, [auth.isAuthenticated, auth.isLoading])

  return (
    <RouterProvider
      context={{
        auth: {
          isAuthenticated: auth.isAuthenticated,
          isLoading: auth.isLoading,
          user: auth.user,
        },
      }}
      router={router}
    />
  )
}
