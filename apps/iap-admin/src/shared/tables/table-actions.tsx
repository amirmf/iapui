import type { ComponentPropsWithRef, ReactNode } from 'react'

import { Button, cn } from '@iap/ui'

export function TableActions(props: {
  children: ReactNode
  className?: string
}) {
  const { children, className } = props

  return (
    <div className={cn('flex items-center gap-1', className)}>{children}</div>
  )
}

export type TableActionButtonProps = Omit<
  ComponentPropsWithRef<typeof Button>,
  'children' | 'size'
> & {
  icon: ReactNode
  label: string
}

export function TableActionButton(props: TableActionButtonProps) {
  const { className, icon, label, ref, ...rest } = props

  return (
    <Button
      {...rest}
      aria-label={label}
      className={cn('size-9 p-0', className)}
      ref={ref}
      size='sm'
      title={label}
      variant={rest.variant ?? 'ghost'}
    >
      {icon}
    </Button>
  )
}
