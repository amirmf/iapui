import type { ComponentPropsWithRef } from 'react'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from './lib/cn'

export const TooltipProvider = TooltipPrimitive.Provider
export const Tooltip = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger

export function TooltipContent(
  props: ComponentPropsWithRef<typeof TooltipPrimitive.Content>
) {
  const { className, ref, sideOffset = 6, ...rest } = props

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        className={cn(
          'bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 z-50 max-w-64 rounded-md px-3 py-1.5 text-xs shadow-md motion-reduce:animate-none',
          className
        )}
        ref={ref}
        sideOffset={sideOffset}
        {...rest}
      />
    </TooltipPrimitive.Portal>
  )
}
