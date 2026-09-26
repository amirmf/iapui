import { StrictMode } from 'react'

import { queryClient } from '@app/router'
import { configureApiClient } from '@iap/api-client'
import '@iap/design-tokens/theme.css'
import { i18nReady } from '@shared/i18n/i18n'
import { AppProviders } from '@shared/providers/app-providers'
import { AuthenticatedRouterProvider } from '@shared/router/authenticated-router-provider'
import '@styles/index.scss'
import { createRoot } from 'react-dom/client'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('The root element was not found.')
}

void i18nReady.then(() => {
  configureApiClient(
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
  )

  createRoot(rootElement).render(
    <StrictMode>
      <AppProviders queryClient={queryClient}>
        <AuthenticatedRouterProvider />
      </AppProviders>
    </StrictMode>
  )
})
