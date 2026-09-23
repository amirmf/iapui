import type { ComponentPropsWithRef } from 'react'

import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from './lib/cn'

export const Tabs = TabsPrimitive.Root

export type TabsListProps = ComponentPropsWithRef<typeof TabsPrimitive.List>

export function TabsList(props: TabsListProps) {
  const { className, ref, ...rest } = props

  return (
    <TabsPrimitive.List
      className={cn(
        'border-border bg-surface-muted inline-flex min-h-11 max-w-full items-center gap-1 overflow-x-auto rounded-lg border p-1',
        className
      )}
      data-slot='tabs-list'
      ref={ref}
      {...rest}
    />
  )
}

export type TabsTriggerProps = ComponentPropsWithRef<
  typeof TabsPrimitive.Trigger
>

export function TabsTrigger(props: TabsTriggerProps) {
  const { className, ref, ...rest } = props

  return (
    <TabsPrimitive.Trigger
      className={cn(
        'text-muted-foreground hover:bg-surface hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background data-[state=active]:bg-surface data-[state=active]:text-foreground inline-flex min-h-11 shrink-0 items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      data-slot='tabs-trigger'
      ref={ref}
      {...rest}
    />
  )
}

export type TabsContentProps = ComponentPropsWithRef<
  typeof TabsPrimitive.Content
>

export function TabsContent(props: TabsContentProps) {
  const { className, ref, ...rest } = props

  return (
    <TabsPrimitive.Content
      className={cn('mt-4 outline-none', className)}
      data-slot='tabs-content'
      ref={ref}
      {...rest}
    />
  )
}
