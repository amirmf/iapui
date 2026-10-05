import { useAuthNavigation } from '@features/auth/route-adapters/use-auth-navigation'
import { LoginPage, useLoginPageAccess } from '@iap/auth'
import { authBrand } from '@shared/config/auth-brand'

import { AuthPageLoading } from './auth-page-loading'

export function Login() {
  const onNavigate = useAuthNavigation()
  const { isAuthenticated, isLoading } = useLoginPageAccess(onNavigate)

  if (isLoading) return <AuthPageLoading />
  if (isAuthenticated) return null

  return <LoginPage brand={authBrand} onNavigate={onNavigate} />
}
