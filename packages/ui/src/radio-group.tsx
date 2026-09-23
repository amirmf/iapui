import type { ComponentPropsWithRef } from 'react'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'

import { cn } from './lib/cn'

export type RadioGroupProps = ComponentPropsWithRef<
  typeof RadioGroupPrimitive.Root
>

export function RadioGroup(props: RadioGroupProps) {
  const { className, ...rest } = props
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-3', className)}
      data-slot='radio-group'
      {...rest}
    />
  )
}

export type RadioGroupItemProps = ComponentPropsWithRef<
  typeof RadioGroupPrimitive.Item
>

export function RadioGroupItem(props: RadioGroupItemProps) {
  const { className, ref, ...rest } = props
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        'border-input bg-surface text-primary hover:bg-surface-muted focus-visible:ring-ring focus-visible:ring-offset-background aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/30 aria-[invalid=true]:focus-visible:ring-destructive inline-flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:ring-2',
        className
      )}
      data-slot='radio-group-item'
      ref={ref}
      {...rest}
    >
      <RadioGroupPrimitive.Indicator
        className='bg-primary flex size-4 items-center justify-center rounded-full'
        data-slot='radio-group-indicator'
      />
    </RadioGroupPrimitive.Item>
  )
}
