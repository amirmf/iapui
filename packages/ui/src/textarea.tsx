import { type ComponentPropsWithRef } from 'react'

import { cn } from './lib/cn'

export type TextareaProps = ComponentPropsWithRef<'textarea'>

export function Textarea(props: TextareaProps) {
  const { className, ref, ...rest } = props
  return (
    <textarea
      ref={ref}
      className={cn(
        'border-input bg-surface text-foreground placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:ring-offset-background aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/30 aria-[invalid=true]:focus-visible:ring-destructive flex min-h-28 w-full rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:ring-2',
        className
      )}
      data-slot='textarea'
      {...rest}
    />
  )
}
