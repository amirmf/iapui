import type { ComponentPropsWithRef } from 'react'

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

import { cn } from './lib/cn'

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuGroup = DropdownMenuPrimitive.Group
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal
export const DropdownMenuSub = DropdownMenuPrimitive.Sub
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

export function DropdownMenuContent(
  props: ComponentPropsWithRef<typeof DropdownMenuPrimitive.Content>
) {
  const { align = 'center', className, ref, sideOffset = 4, ...rest } = props

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        align={align}
        className={cn(
          'border-border bg-popover text-popover-foreground data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 z-50 min-w-32 overflow-hidden rounded-lg border p-1 shadow-lg outline-none motion-reduce:animate-none',
          className
        )}
        ref={ref}
        sideOffset={sideOffset}
        {...rest}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

export function DropdownMenuItem(
  props: ComponentPropsWithRef<typeof DropdownMenuPrimitive.Item>
) {
  const { className, ref, ...rest } = props

  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        'focus:bg-surface-muted focus:text-foreground flex min-h-9 cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      ref={ref}
      {...rest}
    />
  )
}

export function DropdownMenuLabel(
  props: ComponentPropsWithRef<typeof DropdownMenuPrimitive.Label>
) {
  const { className, ref, ...rest } = props
  return (
    <DropdownMenuPrimitive.Label
      className={cn('px-2 py-1.5 text-sm font-semibold', className)}
      ref={ref}
      {...rest}
    />
  )
}

export function DropdownMenuSeparator(
  props: ComponentPropsWithRef<typeof DropdownMenuPrimitive.Separator>
) {
  const { className, ref, ...rest } = props
  return (
    <DropdownMenuPrimitive.Separator
      className={cn('bg-border -mx-1 my-1 h-px', className)}
      ref={ref}
      {...rest}
    />
  )
}
