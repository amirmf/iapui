import type { ComponentPropsWithRef } from 'react'

import { Command as CommandPrimitive } from 'cmdk'
import { Search } from 'lucide-react'

import { cn } from './lib/cn'

export function Command(props: ComponentPropsWithRef<typeof CommandPrimitive>) {
  const { className, ...rest } = props
  return (
    <CommandPrimitive
      data-slot='command'
      className={cn(
        'bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md',
        className
      )}
      {...rest}
    />
  )
}

export function CommandInput(
  props: ComponentPropsWithRef<typeof CommandPrimitive.Input>
) {
  const { className, ...rest } = props
  return (
    <div
      data-slot='command-input-wrapper'
      className='flex h-9 items-center gap-2 border-b px-3'
    >
      <Search aria-hidden='true' className='size-4 shrink-0 opacity-50' />
      <CommandPrimitive.Input
        data-slot='command-input'
        className={cn(
          'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...rest}
      />
    </div>
  )
}

export function CommandList(
  props: ComponentPropsWithRef<typeof CommandPrimitive.List>
) {
  const { className, ...rest } = props
  return (
    <CommandPrimitive.List
      data-slot='command-list'
      className={cn(
        'max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto',
        className
      )}
      {...rest}
    />
  )
}

export function CommandEmpty(
  props: ComponentPropsWithRef<typeof CommandPrimitive.Empty>
) {
  const { className, ...rest } = props
  return (
    <CommandPrimitive.Empty
      data-slot='command-empty'
      className={cn('py-4 text-center text-sm', className)}
      {...rest}
    />
  )
}

export function CommandGroup(
  props: ComponentPropsWithRef<typeof CommandPrimitive.Group>
) {
  const { className, ...rest } = props
  return (
    <CommandPrimitive.Group
      data-slot='command-group'
      className={cn(
        'text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium',
        className
      )}
      {...rest}
    />
  )
}

export function CommandItem(
  props: ComponentPropsWithRef<typeof CommandPrimitive.Item>
) {
  const { className, ...rest } = props
  return (
    <CommandPrimitive.Item
      data-slot='command-item'
      className={cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...rest}
    />
  )
}

export function CommandSeparator(
  props: ComponentPropsWithRef<typeof CommandPrimitive.Separator>
) {
  const { className, ...rest } = props
  return (
    <CommandPrimitive.Separator
      data-slot='command-separator'
      className={cn('bg-border -mx-1 h-px', className)}
      {...rest}
    />
  )
}
