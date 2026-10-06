import type { ComponentPropsWithRef } from 'react'

import { cn } from './lib/cn'

export function Separator(
  props: ComponentPropsWithRef<'div'> & {
    orientation?: 'horizontal' | 'vertical'
    decorative?: boolean
  }
) {
  const {
    className,
    orientation = 'horizontal',
    decorative = true,
    ...rest
  } = props
  return (
    <div
      data-slot='separator'
      data-orientation={orientation}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        className
      )}
      {...rest}
    />
  )
}
