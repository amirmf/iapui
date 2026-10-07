import type { ComponentPropsWithoutRef } from 'react'

import { Slot } from '@radix-ui/react-slot'
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
  VariantProps<typeof badgeVariants> & {
    presentation?: 'default' | 'reference'
    asChild?: boolean
  }

export function Badge(props: BadgeProps) {
  const {
    className,
    variant,
    presentation = 'default',
    asChild = false,
    ...rest
  } = props
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      className={cn(
        badgeVariants({ variant }),
        presentation === 'reference' &&
          'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 w-fit overflow-hidden transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none',
        className
      )}
      data-slot='badge'
      {...rest}
    />
  )
}
