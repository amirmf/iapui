import type { ComponentPropsWithRef } from 'react'

import { cn } from './lib/cn'

export function Table(props: ComponentPropsWithRef<'table'>) {
  const { className, ref, ...rest } = props

  return (
    <div className='w-full overflow-x-auto'>
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm', className)}
        {...rest}
      />
    </div>
  )
}

export function TableHeader(props: ComponentPropsWithRef<'thead'>) {
  const { className, ref, ...rest } = props

  return (
    <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...rest} />
  )
}

export function TableBody(props: ComponentPropsWithRef<'tbody'>) {
  const { className, ref, ...rest } = props

  return (
    <tbody
      ref={ref}
      className={cn('[&_tr:last-child]:border-0', className)}
      {...rest}
    />
  )
}

export function TableFooter(props: ComponentPropsWithRef<'tfoot'>) {
  const { className, ref, ...rest } = props

  return (
    <tfoot
      ref={ref}
      className={cn(
        'bg-surface-muted border-t font-medium [&>tr]:last:border-b-0',
        className
      )}
      {...rest}
    />
  )
}

export function TableRow(props: ComponentPropsWithRef<'tr'>) {
  const { className, ref, ...rest } = props

  return (
    <tr
      ref={ref}
      className={cn(
        'hover:bg-surface-muted/60 data-[state=selected]:bg-surface-muted border-b transition-colors',
        className
      )}
      {...rest}
    />
  )
}

export function TableHead(props: ComponentPropsWithRef<'th'>) {
  const { className, ref, ...rest } = props

  return (
    <th
      ref={ref}
      className={cn(
        'text-muted-foreground h-11 px-4 text-start align-middle text-xs font-semibold whitespace-nowrap [&:has([role=checkbox])]:pe-0',
        className
      )}
      {...rest}
    />
  )
}

export function TableCell(props: ComponentPropsWithRef<'td'>) {
  const { className, ref, ...rest } = props

  return (
    <td
      ref={ref}
      className={cn(
        'p-4 align-middle [&:has([role=checkbox])]:pe-0',
        className
      )}
      {...rest}
    />
  )
}

export function TableCaption(props: ComponentPropsWithRef<'caption'>) {
  const { className, ref, ...rest } = props

  return (
    <caption
      ref={ref}
      className={cn('text-muted-foreground mt-4 text-sm', className)}
      {...rest}
    />
  )
}
