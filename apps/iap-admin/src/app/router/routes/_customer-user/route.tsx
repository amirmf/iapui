import { beforeLoadAuth } from '@iap/auth'
import { CustomerUserLayout } from '@shared/app-shell/customer-user-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_customer-user')({
  beforeLoad: ({ context, location }) => {
    beforeLoadAuth({
      appDomainUrl: import.meta.env.VITE_IAP_APP_DOMAIN_URL,
      auth: context.auth,
      pathname: location.pathname,
      search: location.searchStr,
    })
  },
  component: CustomerUserLayout,
})
