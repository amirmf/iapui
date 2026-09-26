import type { ComponentPropsWithoutRef } from 'react'

import * as LabelPrimitive from '@radix-ui/react-label'

import { cn } from './lib/cn'

export type LabelProps = ComponentPropsWithoutRef<typeof LabelPrimitive.Root>

export function Label(props: LabelProps) {
  const { className, ...rest } = props
  return (
    <LabelPrimitive.Root
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className
      )}
      data-slot='label'
      {...rest}
    />
  )
}
