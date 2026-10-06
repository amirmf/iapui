import type { ComponentPropsWithRef } from 'react'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from './lib/cn'

export const TooltipProvider = TooltipPrimitive.Provider
export const Tooltip = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger

export function TooltipContent(
  props: ComponentPropsWithRef<typeof TooltipPrimitive.Content> & {
    presentation?: 'default' | 'reference'
  }
) {
  const {
    className,
    ref,
    sideOffset,
    presentation = 'default',
    children,
    ...rest
  } = props

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        className={cn(
          presentation === 'reference' &&
            'text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-[var(--radix-tooltip-content-transform-origin)] rounded-md bg-gray-600 px-3 py-1.5 text-xs text-balance dark:bg-gray-200 dark:text-gray-900',
          presentation !== 'reference' &&
            'bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 z-50 max-w-64 rounded-md px-3 py-1.5 text-xs shadow-md motion-reduce:animate-none',
          className
        )}
        ref={ref}
        sideOffset={sideOffset ?? (presentation === 'reference' ? 0 : 6)}
        {...rest}
      >
        {children}
        {presentation === 'reference' ? (
          <TooltipPrimitive.Arrow className='z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-gray-600 fill-gray-600 dark:bg-gray-200 dark:fill-gray-200' />
        ) : null}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}
