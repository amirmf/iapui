import type { ComponentPropsWithoutRef } from 'react'

import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from './lib/cn'

export const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-hover',
        secondary:
          'bg-accent text-accent-foreground hover:bg-accent/90 active:bg-accent/80',
        outline:
          'border border-border bg-surface text-foreground hover:bg-surface-muted active:bg-surface-muted',
        ghost:
          'bg-transparent text-foreground hover:bg-surface-muted active:bg-surface-muted',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80',
      },
      size: {
        sm: 'min-h-9 px-3 text-xs',
        default: 'min-h-11 px-4',
        lg: 'min-h-12 px-6 text-base',
        icon: 'size-11 min-h-0 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export type ButtonProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

export function Button(props: ButtonProps) {
  const {
    asChild = false,
    className,
    size,
    type = 'button',
    variant,
    ...rest
  } = props
  const Component = asChild ? Slot : 'button'

  return (
    <Component
      className={cn(buttonVariants({ className, size, variant }))}
      type={asChild ? undefined : type}
      {...rest}
    />
  )
}
