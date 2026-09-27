import type { ReactNode } from 'react'

export type PermissionProps = {
  children: ReactNode
  hasPermission: boolean
}

/**
 * Renders its children only when the supplied condition is true.
 *
 * This component deliberately does not know about users, roles, or policies,
 * so it can be used for any UI visibility condition.
 */
export function Permission(props: PermissionProps) {
  const { children, hasPermission } = props

  return hasPermission ? children : null
}
