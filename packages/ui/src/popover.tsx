import { type ComponentPropsWithRef } from 'react'

import * as PopoverPrimitive from '@radix-ui/react-popover'

import { cn } from './lib/cn'

export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger
export const PopoverAnchor = PopoverPrimitive.Anchor

export function PopoverContent(
  props: ComponentPropsWithRef<typeof PopoverPrimitive.Content>
) {
  const { align = 'center', className, ref, sideOffset = 8, ...rest } = props
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        className={cn(
          'border-border bg-popover text-popover-foreground data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 z-50 w-72 rounded-xl border p-4 shadow-lg outline-none motion-reduce:animate-none',
          className
        )}
        sideOffset={sideOffset}
        {...rest}
      />
    </PopoverPrimitive.Portal>
  )
}
