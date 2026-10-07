import { act } from 'react'

import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { SupportFlowWidget } from '../components/support-flow-widget'
import { useSupportFlowStore } from '../context/store/support-flow-store'
import { getSupportFlowRouteContext } from './support-route-context'

const translations = vi.hoisted(() => ({
  t: (key: string) => key,
  i18n: { language: 'fa' },
}))
const responses = vi.hoisted(() => ({
  publicAnswer: vi.fn(),
  myAnswer: vi.fn(),
}))
vi.mock('../services/support-service', () => ({ supportService: responses }))
vi.mock('@iap/auth', () => ({
  useAuthSession: () => ({ isAuthenticated: false, user: null }),
}))
vi.mock('react-i18next', () => ({ useTranslation: () => translations }))

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true
let root: Root | undefined
let container: HTMLDivElement | undefined

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
  useSupportFlowStore.setState(useSupportFlowStore.getInitialState(), true)
  responses.publicAnswer.mockResolvedValue({
    nextSelectableQuestionKeys: [{ key: 'login-help' }],
  })
  responses.myAnswer.mockResolvedValue({
    nextSelectableQuestionKeys: [{ key: 'private-help' }],
  })
})
afterEach(async () => {
  if (root) await act(async () => root?.unmount())
  container?.remove()
  vi.restoreAllMocks()
  root = undefined
  container = undefined
})

describe('canonical host support context', () => {
  it.each(['/login', '/login/'])(
    'keeps %s on the public endpoint context',
    (pathname) => {
      expect(getSupportFlowRouteContext(pathname)).toEqual({
        isMyIap: false,
        pageKey: 'login',
        isPublic: true,
      })
    }
  )
  it.each([
    ['/', { isMyIap: false, pageKey: 'panel-root' }],
    [
      '/agent/claim-requests/opaque-id/',
      { isMyIap: false, pageKey: 'agent__claim-requests__UUID' },
    ],
    ['/myiap/', { isMyIap: true, pageKey: 'myiap' }],
  ])('preserves the source context identity for %s', (pathname, expected) => {
    expect(getSupportFlowRouteContext(pathname)).toEqual(expected)
  })
  it('sends the mounted login widget request through publicAnswer under an always-slash router', async () => {
    const rootRoute = createRootRoute({
      component: () => <SupportFlowWidget colorContext='auth' />,
    })
    const loginRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: 'login',
      component: () => null,
    })
    const router = createRouter({
      history: createMemoryHistory({ initialEntries: ['/login/'] }),
      routeTree: rootRoute.addChildren([loginRoute]),
      trailingSlash: 'always',
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    await act(async () => {
      await router.load()
      root?.render(<RouterProvider router={router} />)
    })
    expect(router.state.location.pathname).toBe('/login/')
    expect(responses.publicAnswer).toHaveBeenCalledWith({ pageKey: 'login' })
    expect(responses.myAnswer).not.toHaveBeenCalled()
    expect(useSupportFlowStore.getState().hasInitialQuestions).toBe(true)
  })
})
