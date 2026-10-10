import {
  canAccessAdminPanel,
  canAccessAppPanel,
  canAccessPathByRole,
  canNotAccessPathByRole,
  useAuthSession,
} from '@iap/auth'
import { PanelSwitcher, type PanelSwitcherItem } from '@iap/panel-switcher'
import {
  Building2,
  LayoutDashboard,
  ShieldCheck,
  UserRoundCheck,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function AppPanelSwitcher() {
  const { t } = useTranslation()
  const { user } = useAuthSession()
  const roles = user?.roles ?? []
  const panels: PanelSwitcherItem[] = []

  const adminDomainUrl =
    import.meta.env.VITE_IAP_ADMIN_DOMAIN_URL || 'http://localhost:5174'
  const appDomainUrl =
    import.meta.env.VITE_IAP_APP_DOMAIN_URL || 'http://localhost:5173'

  if (canAccessAdminPanel(roles)) {
    panels.push({
      href: new URL('/', adminDomainUrl).href,
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
      href: new URL('/agent/claim-requests/', adminDomainUrl).href,
      icon: ShieldCheck,
      id: 'agent',
      label: t('panelSwitcher.panels.agent'),
    })
  }

  if (canAccessAppPanel(roles)) {
    panels.push({
      href: new URL('/', appDomainUrl).href,
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
      href: new URL('/customer-user/', adminDomainUrl).href,
      icon: UserRoundCheck,
      id: 'customerUser',
      label: t('panelSwitcher.panels.customerUser'),
    })
  }

  const currentPanel = t('panelSwitcher.panels.customer')

  return (
    <PanelSwitcher
      currentPanelAriaLabel={t('panelSwitcher.current', {
        panel: currentPanel,
      })}
      currentPanelId='app'
      panels={panels}
      switchAriaLabel={t('panelSwitcher.switch', { panel: currentPanel })}
      tone='inverted'
    />
  )
}
