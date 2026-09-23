import type { ComponentPropsWithRef } from 'react'

import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from './lib/cn'

export type SwitchSize = 'default' | 'sm' | 'xs'

export type SwitchProps = ComponentPropsWithRef<typeof SwitchPrimitive.Root> & {
  size?: SwitchSize
}

export function Switch(props: SwitchProps) {
  const { className, ref, size = 'default', ...rest } = props
  const isCompact = size === 'sm'
  const isExtraCompact = size === 'xs'
  const trackSize = isExtraCompact
    ? 'h-5 w-9'
    : isCompact
      ? 'h-7 w-11'
      : 'h-8 w-12'
  const thumbSize = isExtraCompact
    ? 'size-4 data-[state=checked]:translate-x-4 rtl:data-[state=checked]:-translate-x-4'
    : isCompact
      ? 'size-6 data-[state=checked]:translate-x-4 rtl:data-[state=checked]:-translate-x-4'
      : 'size-7 data-[state=checked]:translate-x-4 rtl:data-[state=checked]:-translate-x-4'

  return (
    <SwitchPrimitive.Root
      className={cn(
        'border-input bg-surface-muted data-[state=checked]:border-primary data-[state=checked]:bg-primary focus-visible:ring-ring focus-visible:ring-offset-background relative inline-flex shrink-0 items-center rounded-full border p-0.5 transition-colors outline-none before:absolute before:-inset-3 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        trackSize,
        className
      )}
      data-size={size}
      data-slot='switch'
      ref={ref}
      {...rest}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'bg-surface block rounded-full shadow-sm transition-transform',
          thumbSize
        )}
      />
    </SwitchPrimitive.Root>
  )
}
