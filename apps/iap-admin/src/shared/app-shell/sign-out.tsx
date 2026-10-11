import { useAuthSession } from '@iap/auth'
import { DropdownMenuItem } from '@iap/ui'
import { LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function SignOut() {
  const { isAuthenticated, logout } = useAuthSession()
  const { t } = useTranslation()

  if (!isAuthenticated) {
    return null
  }

  return (
    <DropdownMenuItem
      className='cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive'
      onSelect={() => logout()}
    >
      <LogOut />
      <span>{t('common.signOut', 'خروج')}</span>
    </DropdownMenuItem>
  )
}
