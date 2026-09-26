import { beforeLoadAuth } from '@iap/auth'
import { AuthenticatedLayout } from '@shared/app-shell/authenticated-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    beforeLoadAuth({
      appDomainUrl: import.meta.env.VITE_IAP_APP_DOMAIN_URL,
      auth: context.auth,
      pathname: location.pathname,
      search: location.searchStr,
    })
  },
  component: AuthenticatedLayout,
})
