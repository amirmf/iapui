import * as React from 'react'

import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from './lib/cn'

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm grid grid-cols-[0_1fr] items-start gap-y-0.5 has-[>svg]:grid-cols-[1rem_1fr] has-[>svg]:gap-x-3 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        destructive:
          'text-destructive bg-card [&>svg]:text-current [&_[data-slot=alert-description]]:text-destructive/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Alert(
  props: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>
) {
  const { className, variant, ...rest } = props
  return (
    <div
      data-slot='alert'
      role='alert'
      className={cn(alertVariants({ variant }), className)}
      {...rest}
    />
  )
}

function AlertTitle(props: React.ComponentProps<'div'>) {
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

function AlertDescription(props: React.ComponentProps<'div'>) {
  const { className, ...rest } = props
  return (
    <div
      data-slot='alert-description'
      className={cn(
        'text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed',
        className
      )}
      {...rest}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
