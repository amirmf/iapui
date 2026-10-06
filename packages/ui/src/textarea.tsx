import { type ComponentPropsWithRef } from 'react'

import { cn } from './lib/cn'

export type TextareaProps = ComponentPropsWithRef<'textarea'> & {
  presentation?: 'default' | 'reference'
}

export function Textarea(props: TextareaProps) {
  const { className, presentation = 'default', ref, ...rest } = props
  return (
    <textarea
      ref={ref}
      className={cn(
        presentation === 'reference' &&
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 flex min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-sm transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        presentation !== 'reference' &&
          'border-input bg-surface text-foreground placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:ring-offset-background aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/30 aria-[invalid=true]:focus-visible:ring-destructive flex min-h-16 w-full rounded-md border px-3 py-2 text-base shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:ring-2 md:text-sm',
        className
      )}
      data-slot='textarea'
      {...rest}
    />
  )
}
