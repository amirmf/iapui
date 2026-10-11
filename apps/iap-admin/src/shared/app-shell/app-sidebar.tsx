import { type ComponentProps, useMemo } from 'react'

import {
  canAccessPathByRole,
  canNotAccessPathByRole,
  useAuthSession,
} from '@iap/auth'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@iap/ui'
import { produce } from 'immer'
import { useTranslation } from 'react-i18next'

import { NavGroup as NavGroupSection } from './nav-group'
import { NavUser } from './nav-user'
import type { NavGroup } from './types'

interface AppSidebarProps extends ComponentProps<typeof Sidebar> {
  navList: NavGroup[]
}

export function AppSidebar(props: AppSidebarProps) {
  const { navList, ...rest } = props
  const { user } = useAuthSession()
  const { i18n } = useTranslation()

  const finalNavGroups = useMemo(() => {
    if (!navList || navList.length === 0) return []
    const items = navList[0]?.items ?? []
    const tmp = produce(items, (draft) => {
      return draft.filter(
        (item) =>
          canAccessPathByRole(user?.roles || [], item.url || '/') &&
          !canNotAccessPathByRole(user?.roles || [], item.url || '/')
      )
    })
    return produce(navList, (draft) => {
      if (draft[0]) {
        draft[0].items = tmp
      }
    })
  }, [navList, user?.roles])

  return (
    <Sidebar
      collapsible='icon'
      side={i18n.dir() === 'rtl' ? 'right' : 'left'}
      variant='floating'
      {...rest}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className='flex cursor-default items-center justify-between pt-2 hover:bg-transparent active:bg-transparent group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0'
              size='lg'
            >
              <img
                alt={import.meta.env.VITE_LOGIN_COMPANY}
                className='size-10 shrink-0 object-cover object-center group-data-[collapsible=icon]:size-8 dark:hidden'
                src={import.meta.env.VITE_SIDEBAR_LOGIN_LOGO}
              />
              <img
                alt={import.meta.env.VITE_LOGIN_COMPANY}
                className='hidden size-10 shrink-0 object-cover object-center group-data-[collapsible=icon]:size-8 dark:block'
                src={import.meta.env.VITE_CUSTOMER_APP_HEADER_LOGO}
              />
              <div className='flex flex-1 items-center justify-end group-data-[collapsible=icon]:hidden'>
                <span className='max-w-20 text-xs font-medium'>
                  {import.meta.env.VITE_LOGIN_TITLE}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {finalNavGroups.map((group, index) => (
          <NavGroupSection key={group.title ?? `group-${index}`} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter>{user ? <NavUser user={user} /> : null}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
