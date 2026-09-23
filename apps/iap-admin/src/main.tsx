import { StrictMode } from 'react'

import { router } from '@app/router'
import '@iap/design-tokens/theme.css'
import '@styles/index.scss'
import { RouterProvider } from '@tanstack/react-router'
import { createRoot } from 'react-dom/client'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('The root element was not found.')
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
