import type { ComponentPropsWithoutRef } from 'react'

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'

import { cn } from './lib/cn'

export const Collapsible = CollapsiblePrimitive.Root
export const CollapsibleContent = CollapsiblePrimitive.Content

export function CollapsibleTrigger(
  props: ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>
) {
  const { className, ...rest } = props
  return (
    <CollapsiblePrimitive.Trigger
      className={cn(
        'group focus-visible:ring-ring focus-visible:ring-offset-background inline-flex min-h-11 items-center gap-2 rounded-lg text-start outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...rest}
    />
  )
}

export function CollapsibleChevron(props: ComponentPropsWithoutRef<'span'>) {
  const { className, ...rest } = props
  return (
    <span
      aria-hidden='true'
      className={cn(
        'inline-flex size-5 shrink-0 items-center justify-center transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none',
        className
      )}
      {...rest}
    >
      ▾
    </span>
  )
}
