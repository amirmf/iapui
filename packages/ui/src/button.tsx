import type { ComponentPropsWithRef } from 'react'

import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from './lib/cn'

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none focus-visible:outline-0 focus-visible:ring-0 focus-visible:shadow-none focus:outline-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        default:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        success:
          'bg-green-600 text-white shadow-sm hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600',
        outline:
          'border bg-white shadow-sm hover:bg-gray-100 hover:text-gray-900 dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        ghost:
          'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-50',
        destructive:
          'bg-destructive text-white shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40',
        link: 'underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export type ButtonProps = ComponentPropsWithRef<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    presentation?: 'default' | 'reference'
  }

export function Button(props: ButtonProps) {
  const {
    asChild = false,
    className,
    ref,
    size,
    type = 'button',
    variant,
    presentation = 'default',
    ...rest
  } = props
  const Component = asChild ? Slot : 'button'

  return (
    <Component
      ref={ref}
      className={cn(
        buttonVariants({ size, variant }),
        presentation === 'reference' &&
          'disabled:bg-muted disabled:text-muted-foreground disabled:pointer-events-auto',
        presentation === 'reference' &&
          variant === 'ghost' &&
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        className
      )}
      data-slot='button'
      type={asChild ? undefined : type}
      {...rest}
    />
  )
}
