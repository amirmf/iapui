import { useEffect } from 'react'

import { useThemeStore } from '@iap/theme'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  cn,
} from '@iap/ui'
import { IconCheck, IconMoon, IconSun } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

interface ThemeSwitchProps {
  iconClassName?: string
  triggerClassName?: string
}

export function ThemeSwitch(props: ThemeSwitchProps) {
  const { iconClassName, triggerClassName } = props
  const { i18n, t } = useTranslation()
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  useEffect(() => {
    const themeColor = theme === 'dark' ? '#020817' : '#fff'
    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor)
  }, [theme])

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild className={triggerClassName}>
        <Button className='scale-95 rounded-full' size='icon' variant='ghost'>
          <IconSun
            className={cn(
              'size-6 rotate-0 scale-100 transition-all sm:size-5 dark:-rotate-90 dark:scale-0',
              iconClassName
            )}
          />
          <IconMoon
            className={cn(
              'absolute size-6 rotate-90 scale-0 transition-all sm:size-5 dark:rotate-0 dark:scale-100',
              iconClassName
            )}
          />
          <span className='sr-only'>
            {t('common.theme.toggle', 'تغییر تم')}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={i18n.dir() === 'rtl' ? 'start' : 'end'}>
        <DropdownMenuItem
          className='flex cursor-pointer items-center justify-between ltr:dir-ltr rtl:dir-rtl'
          onClick={() => setTheme('light')}
        >
          {t('common.theme.light', 'روشن')}
          <IconCheck className={cn(theme !== 'light' && 'hidden')} size={14} />
        </DropdownMenuItem>
        <DropdownMenuItem
          className='flex cursor-pointer items-center justify-between ltr:dir-ltr rtl:dir-rtl'
          onClick={() => setTheme('dark')}
        >
          {t('common.theme.dark', 'تیره')}
          <IconCheck className={cn(theme !== 'dark' && 'hidden')} size={14} />
        </DropdownMenuItem>
        <DropdownMenuItem
          className='flex cursor-pointer items-center justify-between ltr:dir-ltr rtl:dir-rtl'
          onClick={() => setTheme('light')}
        >
          {t('common.theme.system', 'سیستم')}
          <IconCheck className='hidden' size={14} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
