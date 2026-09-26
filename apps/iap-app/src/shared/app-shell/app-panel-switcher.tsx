import {
  canAccessAdminPanel,
  canAccessAppPanel,
  useAuthSession,
} from '@iap/auth'
import { PanelSwitcher, type PanelSwitcherItem } from '@iap/panel-switcher'
import { Building2, LayoutDashboard } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function AppPanelSwitcher() {
  const { t } = useTranslation()
  const { user } = useAuthSession()
  const roles = user?.roles ?? []
  const panels: PanelSwitcherItem[] = []

  if (canAccessAppPanel(roles)) {
    panels.push({
      href: new URL('/', import.meta.env.VITE_IAP_APP_DOMAIN_URL).href,
      icon: Building2,
      id: 'app',
      label: t('panelSwitcher.panels.customer'),
    })
  }

  if (canAccessAdminPanel(roles)) {
    panels.push({
      href: new URL('/', import.meta.env.VITE_IAP_ADMIN_DOMAIN_URL).href,
      icon: LayoutDashboard,
      id: 'admin',
      label: t('panelSwitcher.panels.evaluation'),
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
