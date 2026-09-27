import type { ComponentPropsWithRef } from 'react'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'

import { cn } from './lib/cn'

export type CheckboxProps = ComponentPropsWithRef<typeof CheckboxPrimitive.Root>

export function Checkbox(props: CheckboxProps) {
  const { className, ref, ...rest } = props

  return (
    <CheckboxPrimitive.Root
      className={cn(
        'peer border-input bg-surface focus-visible:ring-ring data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary size-4 shrink-0 rounded-sm border shadow-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...rest}
    >
      <CheckboxPrimitive.Indicator className='text-primary-foreground flex items-center justify-center'>
        <Check aria-hidden='true' className='size-3.5' />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
