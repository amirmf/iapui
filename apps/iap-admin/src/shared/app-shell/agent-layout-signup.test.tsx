import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AgentLayout } from './agent-layout'

const state = vi.hoisted(() => ({ pathname: '/agent/users/create/' }))
vi.mock('@iap/auth', () => ({
  useAuthSession: () => ({
    isLoading: false,
    logout: vi.fn(),
    user: { roles: [] },
  }),
  AuditInformationDialog: () => null,
  ForcePasswordChangeDialog: () => null,
}))
vi.mock('@iap/support', () => ({ SupportFlowWidget: () => null }))
vi.mock('@tanstack/react-router', () => ({
  useLocation: (options: {
    select: (location: { pathname: string }) => unknown
  }) => options.select(state),
  Outlet: () => <main data-testid='page' />,
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock('./admin-sidebar', () => ({ AdminSidebar: () => null }))
vi.mock('./admin-header', () => ({ AdminHeader: () => <header /> }))

afterEach(cleanup)
describe('agent signup host scope', () => {
  it.each(['/agent/users/create', '/agent/users/create/'])(
    'uses source host spacing and one main for %s',
    (pathname) => {
      state.pathname = pathname
      const { container } = render(<AgentLayout />)
      const host = container.querySelector('#main-content')!
      expect(host.tagName).toBe('DIV')
      expect(host.className).toContain('pt-6')
      expect(host.className).toContain('pb-0')
      expect(host.className).not.toContain('max-w-[1600px]')
      expect(host.parentElement!.className).toContain('sm:px-2')
      expect(container.querySelectorAll('main')).toHaveLength(1)
    }
  )
  it('retains the existing wrapper for another agent page', () => {
    state.pathname = '/agent/claim-requests/'
    const { container } = render(<AgentLayout />)
    const host = container.querySelector('#main-content')!
    expect(host.tagName).toBe('MAIN')
    expect(host.className).toContain('py-6')
    expect(host.className).toContain('max-w-[1600px]')
    expect(host.parentElement!.className).not.toContain('sm:px-2')
  })
})
