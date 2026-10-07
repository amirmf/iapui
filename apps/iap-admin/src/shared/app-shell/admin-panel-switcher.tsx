import {
  canAccessAdminPanel,
  canAccessAppPanel,
  canAccessPathByRole,
  canNotAccessPathByRole,
  useAuthSession,
} from '@iap/auth'
import { PanelSwitcher, type PanelSwitcherItem } from '@iap/panel-switcher'
import { useRouterState } from '@tanstack/react-router'
import {
  Building2,
  LayoutDashboard,
  ShieldCheck,
  UserRoundCheck,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function AdminPanelSwitcher() {
  const { t } = useTranslation()
  const { user } = useAuthSession()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const roles = user?.roles ?? []
  const panels: PanelSwitcherItem[] = []

  if (canAccessAdminPanel(roles)) {
    panels.push({
      href: new URL('/', import.meta.env.VITE_IAP_ADMIN_DOMAIN_URL).href,
      icon: LayoutDashboard,
      id: 'admin',
      label: t('panelSwitcher.panels.evaluation'),
    })
  }

  if (
    canAccessPathByRole(roles, '/agent') &&
    !canNotAccessPathByRole(roles, '/agent')
  ) {
    panels.push({
      href: new URL(
        '/agent/claim-requests/',
        import.meta.env.VITE_IAP_ADMIN_DOMAIN_URL
      ).href,
      icon: ShieldCheck,
      id: 'agent',
      label: t('panelSwitcher.panels.agent'),
    })
  }

  if (canAccessAppPanel(roles)) {
    panels.push({
      href: new URL('/', import.meta.env.VITE_IAP_APP_DOMAIN_URL).href,
      icon: Building2,
      id: 'app',
      label: t('panelSwitcher.panels.customer'),
    })
  }

  if (
    canAccessPathByRole(roles, '/customer-user') &&
    !canNotAccessPathByRole(roles, '/customer-user')
  ) {
    panels.push({
      href: new URL(
        '/customer-user/',
        import.meta.env.VITE_IAP_ADMIN_DOMAIN_URL
      ).href,
      icon: UserRoundCheck,
      id: 'customerUser',
      label: t('panelSwitcher.panels.customerUser'),
    })
  }

  let currentPanelId = 'admin'
  if (pathname === '/agent' || pathname.startsWith('/agent/')) {
    currentPanelId = 'agent'
  } else if (
    pathname === '/customer-user' ||
    pathname.startsWith('/customer-user/')
  ) {
    currentPanelId = 'customerUser'
  }

  const currentPanel =
    panels.find((panel) => panel.id === currentPanelId)?.label ||
    t('panelSwitcher.panels.evaluation')

  return (
    <PanelSwitcher
      currentPanelAriaLabel={t('panelSwitcher.current', {
        panel: currentPanel,
      })}
      currentPanelId={currentPanelId}
      panels={panels}
      switchAriaLabel={t('panelSwitcher.switch', { panel: currentPanel })}
    />
  )
}
