import { beforeLoadPublicApp } from '@iap/auth'
import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    beforeLoadPublicApp({
      adminDomainUrl: import.meta.env.VITE_IAP_ADMIN_DOMAIN_URL,
      auth: context.auth,
      pathname: location.pathname,
      search: location.searchStr,
    })
  },
  component: Outlet,
})
