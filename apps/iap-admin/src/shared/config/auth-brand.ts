import type { AuthBrand } from '@iap/auth'

export const authBrand: AuthBrand = {
  company: import.meta.env.VITE_LOGIN_COMPANY || 'IAP',
  logoUrl: import.meta.env.VITE_LOGIN_LOGO,
  title: import.meta.env.VITE_LOGIN_TITLE || 'IAP',
}
