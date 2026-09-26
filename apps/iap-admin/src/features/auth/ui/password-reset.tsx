import { PasswordResetPage } from '@iap/auth'
import { authBrand } from '@shared/config/auth-brand'

import { useAuthNavigation } from '../model/use-auth-navigation'

export function PasswordReset() {
  return (
    <PasswordResetPage brand={authBrand} onNavigate={useAuthNavigation()} />
  )
}
