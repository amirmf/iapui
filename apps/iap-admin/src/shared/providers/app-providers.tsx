import type { ReactNode } from 'react'

import { AuthSessionProvider } from '@iap/auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

type AppProvidersProps = {
  children: ReactNode
  queryClient: QueryClient
}

export function AppProviders(props: AppProvidersProps) {
  const { children, queryClient } = props

  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionProvider>{children}</AuthSessionProvider>
    </QueryClientProvider>
  )
}
