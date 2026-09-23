'use client'

import {
  Toaster as SonnerToaster,
  type ToasterProps as SonnerToasterProps,
} from 'sonner'

import { cn } from './lib/cn'

export type ToasterProps = SonnerToasterProps

export function Toaster(props: ToasterProps) {
  const { className, dir = 'auto', ...rest } = props
  return (
    <SonnerToaster
      className={cn('font-sans', className)}
      dir={dir}
      toastOptions={{
        classNames: {
          toast:
            'border border-border bg-surface-elevated text-foreground shadow-lg',
          description: 'text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-surface-muted text-foreground',
          error: 'border-destructive',
          success: 'border-success',
        },
      }}
      {...rest}
    />
  )
}
