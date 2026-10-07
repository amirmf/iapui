import type { ComponentProps } from 'react'

import { cn } from '@iap/ui'

export function Alert(
  props: ComponentProps<'div'> & { variant?: 'default' | 'destructive' }
) {
  const { className, variant, ...rest } = props
  return (
    <div
      data-slot='alert'
      role='alert'
      className={cn(
        'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[1rem_1fr] has-[>svg]:gap-x-3 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
        variant === 'destructive'
          ? 'bg-card text-destructive [&>svg]:text-current [&_[data-slot=alert-description]]:text-destructive/90'
          : 'bg-card text-card-foreground',
        className
      )}
      {...rest}
    />
  )
}
export function AlertTitle(props: ComponentProps<'div'>) {
  const { className, ...rest } = props
  return (
    <div
      data-slot='alert-title'
      className={cn(
        'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight',
        className
      )}
      {...rest}
    />
  )
}
export function AlertDescription(props: ComponentProps<'div'>) {
  const { className, ...rest } = props
  return (
    <div
      data-slot='alert-description'
      className={cn(
        'col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed',
        className
      )}
      {...rest}
    />
  )
}
