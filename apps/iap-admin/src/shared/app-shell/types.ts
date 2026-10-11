import type { ElementType } from 'react'

export interface User {
  name: string
  email: string
  avatar: string
}

export interface Team {
  name: string
  logo: ElementType
  plan: string
}

export interface BaseNavItem {
  title: string
  badge?: string
  icon?: ElementType
  filter?: Record<string, unknown>
  matchDescendants?: boolean
}

export type NavLink = BaseNavItem & {
  url: string
  items?: never
}

export type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: string })[]
  url?: never
}

export type NavItem = NavCollapsible | NavLink

export interface NavGroup {
  title?: string | null
  items: NavItem[]
}

export interface SidebarData {
  user: User
  teams: Team[]
  navGroups: NavGroup[]
}
