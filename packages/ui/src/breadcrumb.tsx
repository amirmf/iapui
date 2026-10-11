import type { ComponentProps } from 'react'

import { Slot } from '@radix-ui/react-slot'
import { ChevronRight, MoreHorizontal } from 'lucide-react'

import { cn } from './lib/cn'

export function Breadcrumb(props: ComponentProps<'nav'>) {
  return <nav aria-label='breadcrumb' data-slot='breadcrumb' {...props} />
}

export function BreadcrumbList(props: ComponentProps<'ol'>) {
  const { className, ...rest } = props
  return (
    <ol
      data-slot='breadcrumb-list'
      className={cn(
        'text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5',
        className
      )}
      {...rest}
    />
  )
}

export function BreadcrumbItem(props: ComponentProps<'li'>) {
  const { className, ...rest } = props
  return (
    <li
      data-slot='breadcrumb-item'
      className={cn('inline-flex items-center gap-1.5', className)}
      {...rest}
    />
  )
}

export function BreadcrumbLink(
  props: ComponentProps<'a'> & {
    asChild?: boolean
  }
) {
  const { asChild, className, ...rest } = props
  const Comp = asChild ? Slot : 'a'

  return (
    <Comp
      data-slot='breadcrumb-link'
      className={cn('hover:text-foreground transition-colors', className)}
      {...rest}
    />
  )
}

export function BreadcrumbPage(props: ComponentProps<'span'>) {
  const { className, ...rest } = props
  return (
    <span
      data-slot='breadcrumb-page'
      role='link'
      aria-disabled='true'
      aria-current='page'
      className={cn('text-foreground font-normal', className)}
      {...rest}
    />
  )
}

export function BreadcrumbSeparator(props: ComponentProps<'li'>) {
  const { children, className, ...rest } = props
  return (
    <li
      data-slot='breadcrumb-separator'
      role='presentation'
      aria-hidden='true'
      className={cn('[&>svg]:size-3.5', className)}
      {...rest}
    >
      {children ?? <ChevronRight className='rtl:rotate-180' />}
    </li>
  )
}

export function BreadcrumbEllipsis(props: ComponentProps<'span'>) {
  const { className, ...rest } = props
  return (
    <span
      data-slot='breadcrumb-ellipsis'
      role='presentation'
      aria-hidden='true'
      className={cn('flex size-9 items-center justify-center', className)}
      {...rest}
    >
      <MoreHorizontal className='size-4' />
      <span className='sr-only'>More</span>
    </span>
  )
}
