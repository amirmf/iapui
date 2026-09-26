import { useCallback } from 'react'

import {
  type AuthDestination,
  LoginPage,
  PasswordResetPage,
  RegisterPage,
  SsoPage,
} from '@iap/auth'
import { authBrand } from '@shared/config/auth-brand'
import { useNavigate } from '@tanstack/react-router'

function useAuthNavigation() {
  const navigate = useNavigate()

  return useCallback(
    (destination: AuthDestination) => {
      switch (destination) {
        case 'home':
          void navigate({ to: '/' })
          return
        case 'login':
          void navigate({ to: '/login/' })
          return
        case 'password-reset':
          void navigate({ to: '/password-reset/' })
          return
        case 'register':
          void navigate({ to: '/register/' })
      }
    },
    [navigate]
  )
}

export function Login() {
  return <LoginPage brand={authBrand} onNavigate={useAuthNavigation()} />
}

export function Register() {
  return <RegisterPage brand={authBrand} onNavigate={useAuthNavigation()} />
}

export function PasswordReset() {
  return (
    <PasswordResetPage brand={authBrand} onNavigate={useAuthNavigation()} />
  )
}

export function Sso() {
  return <SsoPage brand={authBrand} onNavigate={useAuthNavigation()} />
}
