import { useAuthNavigation } from '@features/auth/route-adapters/use-auth-navigation'
import { PasswordResetPage } from '@iap/auth'
import { SupportFlowOpenButton } from '@iap/support'
import { authBrand } from '@shared/config/auth-brand'

export function PasswordReset() {
  return (
    <PasswordResetPage
      brand={authBrand}
      onNavigate={useAuthNavigation()}
      footerActions={<SupportFlowOpenButton colorContext='auth' />}
    />
  )
}
