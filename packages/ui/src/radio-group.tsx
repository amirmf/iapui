import type { ComponentPropsWithRef } from 'react'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { CircleIcon } from 'lucide-react'

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
        'border-input text-primary dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aspect-square size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      data-slot='radio-group-item'
      ref={ref}
      {...rest}
    >
      <RadioGroupPrimitive.Indicator
        className='relative flex items-center justify-center'
        data-slot='radio-group-indicator'
      >
        <CircleIcon className='fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2' />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}
