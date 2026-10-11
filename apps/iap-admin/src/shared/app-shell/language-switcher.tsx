import { DropdownMenuItem } from '@iap/ui'
import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const toggle = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'fa' : 'en')
  }

  return (
    <DropdownMenuItem className='cursor-pointer' onClick={toggle}>
      {i18n.language === 'en' ? 'فارسی' : 'English'}
    </DropdownMenuItem>
  )
}
