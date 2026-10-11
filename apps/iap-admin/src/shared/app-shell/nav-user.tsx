import type { AuthUser } from '@iap/api-types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  cn,
  useSidebar,
} from '@iap/ui'
import { ChevronsUpDown, User } from 'lucide-react'

import { LanguageSwitcher } from './language-switcher'
import { SignOut } from './sign-out'

interface NavUserProps {
  isHeader?: boolean
  user: AuthUser
}

export function NavUser(props: NavUserProps) {
  const { isHeader, user } = props
  const { isMobile } = useSidebar()
  const name = user.displayName?.trim() || user.username
  const email = user.email ?? ''

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              size='lg'
            >
              <span className='grid size-6 place-items-center rounded-lg bg-surface-muted text-foreground'>
                <User className='size-4 min-w-4' />
              </span>
              <div
                className={cn(
                  'grid flex-1 text-left text-sm leading-tight',
                  isHeader && 'hidden sm:grid'
                )}
              >
                <span className='truncate font-semibold'>{name}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='start'
            className='min-w-46 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm rtl:dir-rtl'>
                <span className='grid size-6 place-items-center rounded-lg bg-surface-muted text-foreground'>
                  <User className='size-4 min-w-4' />
                </span>
                <div className='grid flex-1 text-sm leading-tight ltr:text-left rtl:text-right'>
                  <span className='truncate font-semibold'>{name}</span>
                  {email ? (
                    <span className='truncate text-xs text-muted-foreground'>
                      {email}
                    </span>
                  ) : null}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <LanguageSwitcher />
            <DropdownMenuSeparator />
            <SignOut />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
