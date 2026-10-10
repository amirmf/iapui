import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { LayoutLoading } from '../layout-loading'
import { MyIapBottomNav } from '../my-iap-bottom-nav'
import { MyIapFooter } from '../my-iap-footer'
import { MyIapHeader } from '../my-iap-header'
import { MyIapUserActions } from '../my-iap-user-actions'

const authState = vi.hoisted(() => ({
  isAuthenticated: true,
  isLoading: false,
  logout: vi.fn(),
  user: {
    displayName: 'سهراب سپهری',
    email: 'sohrab@example.com',
    id: 1,
    roles: ['ROLE_PUBLIC_USER'],
    username: '0012345678',
  },
}))

vi.mock('@iap/auth', () => ({
  canAccessAdminPanel: () => false,
  canAccessAppPanel: () => true,
  canAccessPathByRole: () => true,
  canNotAccessPathByRole: () => false,
  useAuthSession: () => authState,
}))

vi.mock('@iap/theme', () => ({
  ThemeSwitcher: () => <button type='button'>ThemeSwitcher</button>,
  useThemeStore: () => 'light',
}))

vi.mock('@iap/support', () => ({
  useSupportFlow: () => ({
    hasInitialQuestions: true,
    isOpen: false,
    openSupport: vi.fn(),
  }),
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    className,
    to,
  }: {
    children?: React.ReactNode
    className?: string
    to: string
  }) => (
    <a className={className} href={to}>
      {children}
    </a>
  ),
  useLocation: () => ({ pathname: '/' }),
  useRouterState: () => '/',
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: { dir: () => 'rtl' },
    t: (key: string, options?: { company?: string }) => {
      if (options?.company) return `پورتال ${options.company}`
      return key
    },
  }),
}))

describe('MyIapLayout subcomponents reference parity', () => {
  beforeEach(() => {
    authState.isAuthenticated = true
    authState.isLoading = false
    authState.user = {
      displayName: 'سهراب سپهری',
      email: 'sohrab@example.com',
      id: 1,
      roles: ['ROLE_PUBLIC_USER'],
      username: '0012345678',
    }
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  describe('LayoutLoading', () => {
    it('renders loading spinner and translated text when session is loading', () => {
      authState.isLoading = true
      render(
        <LayoutLoading>
          <div>Protected Content</div>
        </LayoutLoading>
      )
      expect(screen.getByText('auth.login.loading')).toBeDefined()
      expect(screen.queryByText('Protected Content')).toBeNull()
    })

    it('renders children when authenticated and loaded', () => {
      authState.isLoading = false
      authState.isAuthenticated = true
      render(
        <LayoutLoading>
          <div>Protected Content</div>
        </LayoutLoading>
      )
      expect(screen.getByText('Protected Content')).toBeDefined()
    })
  })

  describe('MyIapHeader', () => {
    it('renders logo, brand name, and desktop navigation links', () => {
      render(<MyIapHeader />)
      expect(screen.getByText('myiap.nav.home')).toBeDefined()
      expect(screen.getByText('myiap.nav.myClaims')).toBeDefined()
      expect(screen.getByText('myiap.nav.specialDiseases')).toBeDefined()
      expect(screen.getByText('myiap.nav.createClaim')).toBeDefined()
      expect(screen.getByText('سهراب سپهری')).toBeDefined()
    })
  })

  describe('MyIapUserActions', () => {
    it('renders theme switcher and user button', () => {
      render(<MyIapUserActions />)
      expect(screen.getByText('ThemeSwitcher')).toBeDefined()
      expect(screen.getByText('سهراب سپهری')).toBeDefined()
    })
  })

  describe('MyIapFooter', () => {
    it('renders footer navigation links and copyright', () => {
      render(<MyIapFooter />)
      expect(screen.getByText('myiap.nav.home')).toBeDefined()
      expect(screen.getByText('myiap.nav.myClaims')).toBeDefined()
      expect(screen.getByText('myiap.nav.createClaim')).toBeDefined()
      expect(screen.getByText('myiap.footer.copyright')).toBeDefined()
    })
  })

  describe('MyIapBottomNav', () => {
    it('renders mobile navigation links and support bot button', () => {
      render(<MyIapBottomNav />)
      expect(screen.getByText('myiap.nav.home')).toBeDefined()
      expect(screen.getByText('myiap.nav.myClaims')).toBeDefined()
      expect(screen.getByText('myiap.nav.createClaim')).toBeDefined()
      expect(screen.getByText('myiap.nav.specialDiseases')).toBeDefined()
      expect(screen.getByText('supportFlow.bottomNavLabel')).toBeDefined()
    })
  })
})
