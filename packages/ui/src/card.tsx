import type { HTMLAttributes } from 'react'

import { cn } from './lib/cn'

type CardProps = HTMLAttributes<HTMLDivElement> & { as?: 'aside' | 'div' }

export function Card(props: CardProps) {
  const { as = 'div', className, ...rest } = props
  const cardClassName = cn(
    'rounded-xl border border-border/35 bg-card text-card-foreground shadow-sm shadow-primary/5',
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
      className={cn('flex flex-col gap-2 p-5', className)}
      data-slot='card-header'
      {...rest}
    />
  )
}

export function CardTitle(props: HTMLAttributes<HTMLHeadingElement>) {
  const { className, ...rest } = props
  return (
    <h2
      className={cn('text-lg font-semibold', className)}
      data-slot='card-title'
      {...rest}
    />
  )
}

export function CardDescription(props: HTMLAttributes<HTMLParagraphElement>) {
  const { className, ...rest } = props
  return (
    <p
      className={cn('text-muted-foreground text-sm leading-6', className)}
      data-slot='card-description'
      {...rest}
    />
  )
}

export function CardContent(props: HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props
  return (
    <div
      className={cn('p-5 pt-0', className)}
      data-slot='card-content'
      {...rest}
    />
  )
}

export function CardFooter(props: HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props
  return (
    <div
      className={cn('flex items-center gap-3 p-5 pt-0', className)}
      data-slot='card-footer'
      {...rest}
    />
  )
}
