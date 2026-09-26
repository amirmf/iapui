import { useEffect } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import type { AuthPageProps } from '../ui/auth-page.types'
import { useAuthSession } from './auth-session'

type AuthNavigation = AuthPageProps['onNavigate']

export function useAuthenticatedRedirect(onNavigate: AuthNavigation) {
  const { isAuthenticated, isLoading, user } = useAuthSession()

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      onNavigate('home', user)
    }
  }, [isAuthenticated, isLoading, onNavigate, user])

  return { isAuthenticated, isLoading }
}

export function useLoginPageAccess(onNavigate: AuthNavigation) {
  const authSession = useAuthenticatedRedirect(onNavigate)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!authSession.isLoading && !authSession.isAuthenticated) {
      queryClient.clear()
    }
  }, [authSession.isAuthenticated, authSession.isLoading, queryClient])

  return authSession
}

export function useSsoPageAccess(
  onNavigate: AuthNavigation,
  isSsoLoginPending: boolean
) {
  const authSession = useAuthenticatedRedirect(onNavigate)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (
      !authSession.isLoading &&
      !authSession.isAuthenticated &&
      !isSsoLoginPending
    ) {
      queryClient.clear()
    }
  }, [
    authSession.isAuthenticated,
    authSession.isLoading,
    isSsoLoginPending,
    queryClient,
  ])

  return authSession
}
