import type { ComponentPropsWithoutRef } from 'react'

import * as LabelPrimitive from '@radix-ui/react-label'

import { cn } from './lib/cn'

export type LabelProps = ComponentPropsWithoutRef<typeof LabelPrimitive.Root>

export function Label(props: LabelProps) {
  const { className, ...rest } = props
  return (
    <LabelPrimitive.Root
      className={cn(
        'text-foreground inline-flex items-center gap-1.5 text-sm font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className
      )}
      data-slot='label'
      {...rest}
    />
  )
}
