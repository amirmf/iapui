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
        'bg-muted text-muted-foreground inline-flex h-9 items-center justify-center rounded-lg p-0.75',
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
        "text-foreground dark:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 data-[state=active]:bg-background dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
      className={cn('flex-1 outline-none', className)}
      data-slot='tabs-content'
      ref={ref}
      {...rest}
    />
  )
}
