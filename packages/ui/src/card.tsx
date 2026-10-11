import type { HTMLAttributes } from 'react'

import { cn } from './lib/cn'

type CardProps = HTMLAttributes<HTMLDivElement> & { as?: 'aside' | 'div' }

export function Card(props: CardProps) {
  const { as = 'div', className, ...rest } = props
  const cardClassName = cn(
    'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
    className
  )

  if (as === 'aside') {
    return <aside className={cardClassName} data-slot='card' {...rest} />
  }

  return <div className={cardClassName} data-slot='card' {...rest} />
}

export function CardHeader(props: HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props
  return (
    <div
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      data-slot='card-header'
      {...rest}
    />
  )
}

export function CardTitle(
  props: HTMLAttributes<HTMLHeadingElement> & { as?: 'h2' | 'div' }
) {
  const { as: Component = 'h2', className, ...rest } = props
  return (
    <Component
      className={cn('leading-none font-semibold', className)}
      data-slot='card-title'
      {...rest}
    />
  )
}

export function CardDescription(
  props: HTMLAttributes<HTMLParagraphElement> & { as?: 'p' | 'div' }
) {
  const { as: Component = 'p', className, ...rest } = props
  return (
    <Component
      className={cn('text-muted-foreground text-sm', className)}
      data-slot='card-description'
      {...rest}
    />
  )
}

export function CardContent(props: HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props
  return (
    <div className={cn('px-6', className)} data-slot='card-content' {...rest} />
  )
}

export function CardFooter(props: HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props
  return (
    <div
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      data-slot='card-footer'
      {...rest}
    />
  )
}
