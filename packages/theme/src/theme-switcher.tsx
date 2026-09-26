import { Button, cn } from '@iap/ui'
import { Moon, Sun } from 'lucide-react'

import { useThemeStore } from './theme-store'

export type ThemeSwitcherProps = {
  ariaLabel: string
  className?: string
}

export function ThemeSwitcher({ ariaLabel, className }: ThemeSwitcherProps) {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const Icon = theme === 'light' ? Moon : Sun

  return (
    <Button
      aria-label={ariaLabel}
      aria-pressed={theme === 'dark'}
      className={cn(
        'size-11 rounded-full text-inherit hover:bg-white/20 hover:text-inherit focus-visible:ring-2 focus-visible:ring-current dark:hover:bg-white/20 dark:hover:text-inherit',
        className
      )}
      onClick={toggleTheme}
      size='icon'
      title={ariaLabel}
      variant='ghost'
    >
      <Icon aria-hidden='true' className='size-5' />
    </Button>
  )
}
