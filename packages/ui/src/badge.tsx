import type { ComponentPropsWithoutRef } from 'react'

import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from './lib/cn'

export const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 gap-1 [&>svg]:size-3',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        destructive: 'border-transparent bg-destructive text-white',
        outline: 'text-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export type BadgeProps = ComponentPropsWithoutRef<'span'> &
  VariantProps<typeof badgeVariants>

export function Badge(props: BadgeProps) {
  const { className, variant, ...rest } = props

  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      data-slot='badge'
      {...rest}
    />
  )
}
