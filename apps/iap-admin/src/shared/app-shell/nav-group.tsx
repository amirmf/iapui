import type { ReactNode } from 'react'

import {
  Badge,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  cn,
  useSidebar,
} from '@iap/ui'
import { Link, useLocation } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

import { createLinkWithFilter, isNavItemActive } from './nav-utils'
import type { NavCollapsible, NavGroup as NavGroupType, NavLink } from './types'

export function NavGroup(props: NavGroupType) {
  const { items, title } = props
  const { isMobile, state } = useSidebar()
  const href = useLocation({ select: (location) => location.href })

  return (
    <SidebarGroup>
      {title ? <SidebarGroupLabel>{title}</SidebarGroupLabel> : null}
      <SidebarMenu>
        {items.map((item) => {
          const key = `${item.title}-${item.url}`

          if (!item.items) {
            return <SidebarMenuLink href={href} item={item} key={key} />
          }

          if (state === 'collapsed' && !isMobile) {
            return (
              <SidebarMenuCollapsedDropdown href={href} item={item} key={key} />
            )
          }

          return <SidebarMenuCollapsible href={href} item={item} key={key} />
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavBadge(props: { children: ReactNode }) {
  const { children } = props
  return <Badge className='rounded-full px-1 py-0 text-xs'>{children}</Badge>
}

function SidebarMenuLink(props: { href: string; item: NavLink }) {
  const { href, item } = props
  const { setOpenMobile } = useSidebar()
  const Icon = item.icon

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isNavItemActive(href, item)}
        tooltip={item.title}
        variant='primary'
      >
        <Link
          onClick={() => setOpenMobile(false)}
          to={createLinkWithFilter(item.url, item.filter) as never}
        >
          {Icon ? <Icon /> : null}
          <span>{item.title}</span>
          {item.badge ? <NavBadge>{item.badge}</NavBadge> : null}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SidebarMenuCollapsible(props: { href: string; item: NavCollapsible }) {
  const { href, item } = props
  const { setOpenMobile } = useSidebar()
  const Icon = item.icon

  return (
    <Collapsible
      asChild
      className='group/collapsible'
      defaultOpen={isNavItemActive(href, item, true)}
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {Icon ? <Icon /> : null}
            <span>{item.title}</span>
            {item.badge ? <NavBadge>{item.badge}</NavBadge> : null}
            <ChevronRight className='transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-180' />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className='CollapsibleContent'>
          <SidebarMenuSub>
            {item.items.map((subItem) => {
              const SubIcon = subItem.icon
              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isNavItemActive(href, subItem)}
                  >
                    <Link
                      onClick={() => setOpenMobile(false)}
                      to={
                        createLinkWithFilter(
                          subItem.url,
                          subItem.filter
                        ) as never
                      }
                    >
                      {SubIcon ? <SubIcon /> : null}
                      <span>{subItem.title}</span>
                      {subItem.badge ? (
                        <NavBadge>{subItem.badge}</NavBadge>
                      ) : null}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

function SidebarMenuCollapsedDropdown(props: {
  href: string
  item: NavCollapsible
}) {
  const { href, item } = props
  const Icon = item.icon

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            isActive={isNavItemActive(href, item)}
            tooltip={item.title}
          >
            {Icon ? <Icon /> : null}
            <span>{item.title}</span>
            {item.badge ? <NavBadge>{item.badge}</NavBadge> : null}
            <ChevronRight className='transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-180' />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' side='right' sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub) => {
            const SubIcon = sub.icon
            return (
              <DropdownMenuItem asChild key={`${sub.title}-${sub.url}`}>
                <Link
                  className={cn(isNavItemActive(href, sub) && 'bg-secondary')}
                  to={createLinkWithFilter(sub.url, sub.filter) as never}
                >
                  {SubIcon ? <SubIcon /> : null}
                  <span className='max-w-52 text-wrap'>{sub.title}</span>
                  {sub.badge ? (
                    <span className='ml-auto text-xs'>{sub.badge}</span>
                  ) : null}
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}
