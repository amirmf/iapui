import {
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  useEffect,
  useState,
} from 'react'

import { useAuthSession } from '@iap/auth'
import { Separator, SidebarTrigger, cn } from '@iap/ui'

import { AdminPanelSwitcher } from './admin-panel-switcher'
import { Breadcrumb } from './breadcrumb'
import { HeaderDate } from './header-date'
import { NavUser } from './nav-user'
import { ThemeSwitch } from './theme-switch'

interface HeaderProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode
  fixed?: boolean
  homePageUrl?: string
  ref?: Ref<HTMLElement>
}

export function Header(props: HeaderProps) {
  const { children, className, fixed, homePageUrl, ...rest } = props
  const [offset, setOffset] = useState(0)
  const { user } = useAuthSession()

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    document.addEventListener('scroll', onScroll, { passive: true })

    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'flex h-16 max-h-16 items-center gap-3 rounded-[20px] bg-card px-6 py-4 text-foreground shadow-sm transition-shadow sm:gap-4',
        fixed && 'header-fixed peer/header fixed z-50 w-[inherit]',
        offset > 10 && fixed ? 'shadow-md' : '',
        className
      )}
      {...rest}
    >
      <SidebarTrigger
        className='size-8 shrink-0 sm:size-7 [&_svg]:size-4'
        variant='outline'
      />
      <Separator className='h-6' orientation='vertical' />
      <Breadcrumb homePageUrl={homePageUrl} />
      <div className='flex items-center gap-1 ltr:ml-auto rtl:mr-auto'>
        <HeaderDate />
        <AdminPanelSwitcher />
        <ThemeSwitch iconClassName='size-5' />
        {user ? <NavUser isHeader user={user} /> : null}
      </div>
      {children}
    </header>
  )
}

Header.displayName = 'Header'
