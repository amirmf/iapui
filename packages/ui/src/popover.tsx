import { type ComponentPropsWithRef } from 'react'

import * as PopoverPrimitive from '@radix-ui/react-popover'

import { cn } from './lib/cn'

export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger
export const PopoverAnchor = PopoverPrimitive.Anchor

export function PopoverContent(
  props: ComponentPropsWithRef<typeof PopoverPrimitive.Content> & {
    presentation?: 'default' | 'reference'
  }
) {
  const {
    align = 'center',
    className,
    presentation = 'default',
    ref,
    sideOffset = presentation === 'reference' ? 4 : 8,
    ...rest
  } = props
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        data-slot='popover-content'
        align={align}
        className={cn(
          presentation === 'reference' &&
            'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-[var(--radix-popover-content-transform-origin)] rounded-md border p-4 shadow-md outline-none',
          presentation !== 'reference' &&
            'border-border bg-popover text-popover-foreground data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 z-50 w-72 rounded-xl border p-4 shadow-lg outline-none motion-reduce:animate-none',
          className
        )}
        sideOffset={sideOffset}
        {...rest}
      />
    </PopoverPrimitive.Portal>
  )
}
