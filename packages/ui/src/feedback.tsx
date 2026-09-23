import type { HTMLAttributes } from 'react'

import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from './lib/cn'

export function Skeleton(props: HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props
  return (
    <div
      aria-hidden='true'
      className={cn(
        'bg-surface-muted animate-pulse rounded-md motion-reduce:animate-none',
        className
      )}
      data-slot='skeleton'
      {...rest}
    />
  )
}

export const spinnerVariants = cva(
  'animate-spin rounded-full border-2 border-current border-t-transparent',
  {
    variants: {
      size: {
        sm: 'size-4',
        default: 'size-5',
        lg: 'size-7',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

export type SpinnerProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof spinnerVariants> & {
    label: string
  }

export function Spinner(props: SpinnerProps) {
  const { className, label, size, ...rest } = props
  return (
    <div
      className={cn('inline-flex items-center justify-center', className)}
      data-slot='spinner'
      role='status'
      {...rest}
    >
      <span aria-hidden='true' className={cn(spinnerVariants({ size }))} />
      <span className='sr-only'>{label}</span>
    </div>
  )
}
