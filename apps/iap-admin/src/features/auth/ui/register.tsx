import { RegisterPage } from '@iap/auth'
import { authBrand } from '@shared/config/auth-brand'

import { useAuthNavigation } from '../model/use-auth-navigation'

export function Register() {
  return <RegisterPage brand={authBrand} onNavigate={useAuthNavigation()} />
}
