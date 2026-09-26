import { useState } from 'react'

import { SsoPage, useSsoPageAccess } from '@iap/auth'
import { authBrand } from '@shared/config/auth-brand'

import { useAuthNavigation } from '../model/use-auth-navigation'
import { AuthPageLoading } from './auth-page-loading'

export function Sso() {
  const onNavigate = useAuthNavigation()
  const [isSsoLoginPending, setIsSsoLoginPending] = useState(false)
  const { isAuthenticated, isLoading } = useSsoPageAccess(
    onNavigate,
    isSsoLoginPending
  )

  if (isLoading || isAuthenticated) return <AuthPageLoading />

  return (
    <SsoPage
      brand={authBrand}
      onNavigate={onNavigate}
      onPendingChange={setIsSsoLoginPending}
    />
  )
}
