import { StrictMode } from 'react'

import { router } from '@app/router'
import '@iap/design-tokens/theme.css'
import '@iap/ui/date-picker.css'
import { i18n, i18nReady } from '@shared/i18n/i18n'
import '@styles/index.scss'
import { RouterProvider } from '@tanstack/react-router'
import { createRoot } from 'react-dom/client'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('The root element was not found.')
}

void i18nReady.then(() => {
  document.title = i18n.t('meta.appTitle')

  createRoot(rootElement).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  )
})
