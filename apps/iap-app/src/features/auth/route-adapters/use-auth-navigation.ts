import { useCallback } from 'react'

import {
  type AuthDestination,
  type AuthUser,
  getAfterLoginDestination,
  isExternalDestination,
} from '@iap/auth'
import { useLocation, useNavigate } from '@tanstack/react-router'

export type AuthNavigation = (
  destination: AuthDestination,
  user?: AuthUser
) => void

export function useAuthNavigation(): AuthNavigation {
  const location = useLocation()
  const navigate = useNavigate()

  return useCallback(
    (destination: AuthDestination, user?: AuthUser) => {
      switch (destination) {
        case 'home': {
          if (!user) return

          const callbackUrl = new URLSearchParams(location.searchStr).get(
            'callbackUrl'
          )
          const afterLoginDestination = getAfterLoginDestination(
            user.roles ?? [],
            import.meta.env.VITE_IAP_APP_DOMAIN_URL,
            callbackUrl ?? undefined
          )

          if (isExternalDestination(afterLoginDestination)) {
            window.location.assign(afterLoginDestination)
            return
          }

          void navigate({ to: afterLoginDestination as never })
          return
        }
        case 'login':
          void navigate({ to: '/login/' })
          return
        case 'password-reset':
          void navigate({ to: '/password-reset/' })
          return
        case 'register':
          void navigate({ to: '/register/' })
      }
    },
    [location.searchStr, navigate]
  )
}
