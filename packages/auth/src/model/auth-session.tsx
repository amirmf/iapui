import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'

import type { AuthUser } from '@iap/api-types'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { authService } from '../services/auth-service'
import { useAuthStore } from './auth-store'

const currentUserQueryKey = ['auth', 'current-user'] as const

export type AuthSession = {
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
  refreshCurrentUser: () => Promise<AuthUser | null>
  user: AuthUser | null
}

const AuthSessionContext = createContext<AuthSession | null>(null)

type AuthSessionProviderProps = {
  children: ReactNode
}

export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) => state.accessToken)
  const authenticatedUser = useAuthStore((state) => state.user)
  const clearAuthSession = useAuthStore((state) => state.clearSession)
  const setAuthSession = useAuthStore((state) => state.setSession)

  const {
    data: currentUser,
    isError: hasCurrentUserRequestFailed,
    isLoading: isLoadingCurrentUser,
    refetch: refetchCurrentUser,
  } = useQuery({
    enabled: Boolean(accessToken) && !authenticatedUser,
    queryFn: authService.getCurrentUser,
    queryKey: currentUserQueryKey,
    retry: false,
    staleTime: Infinity,
  })

  useEffect(() => {
    if (currentUser && accessToken) {
      setAuthSession({ accessToken, user: currentUser })
    }
  }, [accessToken, currentUser, setAuthSession])

  useEffect(() => {
    if (hasCurrentUserRequestFailed) {
      clearAuthSession()
    }
  }, [clearAuthSession, hasCurrentUserRequestFailed])

  const logout = useCallback(() => {
    queryClient.removeQueries({ queryKey: currentUserQueryKey })
    clearAuthSession()
  }, [clearAuthSession, queryClient])

  const refreshCurrentUser = useCallback(async () => {
    if (!accessToken) {
      return null
    }

    const { data: refreshedUser } = await refetchCurrentUser({
      throwOnError: true,
    })
    const user = refreshedUser ?? null

    if (user) {
      setAuthSession({ accessToken, user })
    }

    return user
  }, [accessToken, refetchCurrentUser, setAuthSession])

  const value = useMemo<AuthSession>(
    () => ({
      accessToken,
      isAuthenticated: Boolean(accessToken && authenticatedUser),
      isLoading:
        Boolean(accessToken) && !authenticatedUser && isLoadingCurrentUser,
      logout,
      refreshCurrentUser,
      user: authenticatedUser,
    }),
    [
      accessToken,
      authenticatedUser,
      isLoadingCurrentUser,
      logout,
      refreshCurrentUser,
    ]
  )

  return <AuthSessionContext value={value}>{children}</AuthSessionContext>
}

export function useAuthSession() {
  const session = useContext(AuthSessionContext)

  if (!session) {
    throw new Error('useAuthSession must be used within AuthSessionProvider.')
  }

  return session
}
