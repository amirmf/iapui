export type AuthDestination = 'home' | 'login' | 'password-reset' | 'register'

export type AuthBrand = {
  company: string
  logoUrl?: string
  title: string
}

export type AuthPageProps = {
  brand: AuthBrand
  onNavigate: (destination: AuthDestination) => void
}
