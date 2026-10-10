import { useAuthSession } from '@iap/auth'
import { ThemeSwitcher } from '@iap/theme'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@iap/ui'
import { LogOut, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function MyIapUserActions() {
  const { logout, user } = useAuthSession()
  const { i18n, t } = useTranslation()

  const name = user?.displayName?.trim() || user?.username || ''
  const email = user?.email ?? ''

  return (
    <div className='flex items-center gap-3'>
      <ThemeSwitcher
        ariaLabel={t('common.theme.toggle')}
        className='text-white hover:bg-white/20 hover:text-white dark:hover:bg-white/20 dark:hover:text-white'
      />

      {user ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            asChild
            className='group text-white hover:bg-white/20 hover:text-white dark:hover:bg-white/20 dark:hover:text-white'
          >
            <Button
              className='relative flex items-center gap-2 px-0 py-0 sm:px-3 sm:py-2'
              variant='ghost'
            >
              <div className='relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 text-white'>
                {user.avatarUrl ? (
                  <img
                    alt={name}
                    className='aspect-square size-full object-cover'
                    src={user.avatarUrl}
                  />
                ) : (
                  <User aria-hidden='true' className='size-5 sm:size-4' />
                )}
              </div>
              <span className='hidden text-sm font-medium sm:inline-block'>
                {name}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={i18n.dir() === 'rtl' ? 'start' : 'end'}
            className='w-40'
          >
            <DropdownMenuLabel>
              <div className='grid flex-1 text-sm leading-tight ltr:text-left rtl:text-right'>
                <p className='text-sm font-medium leading-none'>{name}</p>
                {email ? (
                  <p className='text-xs leading-none text-muted-foreground'>
                    {email}
                  </p>
                ) : null}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive'
              onSelect={() => logout()}
            >
              <LogOut aria-hidden='true' className='size-4' />
              <span>{t('common.signOut')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  )
}
