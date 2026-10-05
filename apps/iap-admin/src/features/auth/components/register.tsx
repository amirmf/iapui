import { useAuthNavigation } from '@features/auth/route-adapters/use-auth-navigation'
import { RegisterPage } from '@iap/auth'
import { authBrand } from '@shared/config/auth-brand'

export function Register() {
  return <RegisterPage brand={authBrand} onNavigate={useAuthNavigation()} />
}
