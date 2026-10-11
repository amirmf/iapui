import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AuthenticatedLayout } from './authenticated-layout'

const authState = vi.hoisted(() => ({
  isAuthenticated: true,
  isLoading: false,
  user: {
    displayName: 'Test User',
    roles: ['ROLE_ADMIN'],
    username: 'testadmin',
  },
}))

vi.mock('@iap/auth', () => ({
  AuditInformationDialog: () => <div data-testid='audit-dialog' />,
  ForcePasswordChangeDialog: () => <div data-testid='force-password-dialog' />,
  canAccessAdminPanel: () => true,
  canAccessAppPanel: () => true,
  canAccessPathByRole: () => true,
  canNotAccessPathByRole: () => false,
  useAuthSession: () => ({
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    logout: vi.fn(),
    user: authState.user,
  }),
}))

vi.mock('./admin-panel-switcher', () => ({
  AdminPanelSwitcher: () => <div data-testid='panel-switcher' />,
}))

vi.mock('@iap/support', () => ({
  SupportFlowProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='support-provider'>{children}</div>
  ),
  SupportFlowWidget: () => <div data-testid='support-widget' />,
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
    ...props
  }: {
    children: React.ReactNode
    to: string
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  Outlet: () => <div data-testid='outlet-content'>Outlet Content</div>,
  useLocation: (options?: {
    select: (location: { href: string; pathname: string }) => unknown
  }) =>
    options
      ? options.select({ href: '/', pathname: '/' })
      : { href: '/', pathname: '/' },
  useMatches: () => [],
  useNavigate: () => vi.fn(),
  useRouterState: () => '/',
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: { dir: () => 'rtl' },
    t: (key: string) => key,
  }),
}))

afterEach(cleanup)

describe('AuthenticatedLayout', () => {
  it('renders loading state when session is loading', () => {
    authState.isLoading = true
    authState.isAuthenticated = false
    authState.user = null as never

    render(<AuthenticatedLayout />)
    expect(screen.getByText('auth.login.loading')).toBeDefined()
  })

  it('renders full shell, header, content, and security dialogs when authenticated', () => {
    authState.isLoading = false
    authState.isAuthenticated = true
    authState.user = {
      displayName: 'Test User',
      roles: ['ROLE_ADMIN'],
      username: 'testadmin',
    }

    render(
      <AuthenticatedLayout>
        <div data-testid='custom-children'>Custom Child</div>
      </AuthenticatedLayout>
    )

    expect(screen.getByTestId('support-provider')).toBeDefined()
    expect(screen.getByTestId('support-widget')).toBeDefined()
    expect(screen.getByTestId('force-password-dialog')).toBeDefined()
    expect(screen.getByTestId('audit-dialog')).toBeDefined()
    expect(screen.getByTestId('custom-children')).toBeDefined()
    expect(document.getElementById('content')).not.toBeNull()
  })

  it('renders Outlet when children is not provided', () => {
    authState.isLoading = false
    authState.isAuthenticated = true
    authState.user = {
      displayName: 'Test User',
      roles: ['ROLE_ADMIN'],
      username: 'testadmin',
    }

    render(<AuthenticatedLayout />)
    expect(screen.getByTestId('outlet-content')).toBeDefined()
  })
})
