import { PasswordReset } from '@features/auth/components/password-reset'
import { Register } from '@features/auth/components/register'
import { useSupportFlowStore } from '@iap/support'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@features/auth/route-adapters/use-auth-navigation', () => ({
  useAuthNavigation: () => vi.fn(),
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'fa' } }),
}))

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
  useSupportFlowStore.setState(useSupportFlowStore.getInitialState(), true)
  useSupportFlowStore.setState({ hasInitialQuestions: true })
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  useSupportFlowStore.setState(useSupportFlowStore.getInitialState(), true)
})

describe('public auth Support entries', () => {
  it.each([
    { pathname: '/register/', Page: Register, pageKey: 'register' },
    {
      pathname: '/password-reset/',
      Page: PasswordReset,
      pageKey: 'password-reset',
    },
  ])(
    'opens Support from the $pageKey footer with public canonical context',
    async ({ pathname, Page, pageKey }) => {
      const rootRoute = createRootRoute({ component: Page })
      const pageRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: pageKey,
        component: () => null,
      })
      const router = createRouter({
        routeTree: rootRoute.addChildren([pageRoute]),
        history: createMemoryHistory({ initialEntries: [pathname] }),
        trailingSlash: 'always',
      })
      await router.load()
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })
      render(
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      )
      const button = await screen.findByRole('button', {
        name: 'supportFlow.openLabel',
      })
      expect(button.classList.contains('md:hidden')).toBe(true)
      fireEvent.click(button)
      expect(useSupportFlowStore.getState()).toMatchObject({
        isOpen: true,
        context: { isMyIap: false, isPublic: true, pageKey },
      })
      queryClient.clear()
    }
  )
})
