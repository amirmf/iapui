import { LoginPage, useLoginPageAccess } from '@iap/auth'
import { authBrand } from '@shared/config/auth-brand'

import { useAuthNavigation } from '../model/use-auth-navigation'
import { AuthPageLoading } from './auth-page-loading'

export function Login() {
  const onNavigate = useAuthNavigation()
  const { isAuthenticated, isLoading } = useLoginPageAccess(onNavigate)

  if (isLoading) return <AuthPageLoading />
  if (isAuthenticated) return null

  return <LoginPage brand={authBrand} onNavigate={onNavigate} />
}
