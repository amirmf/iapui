import {
  type ComponentPropsWithRef,
  type ComponentPropsWithoutRef,
} from 'react'

import * as DialogPrimitive from '@radix-ui/react-dialog'

import { cn } from './lib/cn'

const sheetSideClasses = {
  left: 'left-0 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
  right:
    'right-0 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
} as const

export const Sheet = DialogPrimitive.Root
export const SheetTrigger = DialogPrimitive.Trigger
export const SheetClose = DialogPrimitive.Close
export const SheetPortal = DialogPrimitive.Portal

export function SheetOverlay(
  props: ComponentPropsWithRef<typeof DialogPrimitive.Overlay>
) {
  const { className, ref, ...rest } = props

  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'bg-background/80 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50 data-[state=closed]:duration-200 data-[state=open]:duration-300 motion-reduce:animate-none',
        className
      )}
      {...rest}
    />
  )
}

export type SheetSide = keyof typeof sheetSideClasses

export type SheetContentProps = ComponentPropsWithRef<
  typeof DialogPrimitive.Content
> & {
  closeLabel?: string
  side?: SheetSide
}

export function SheetContent(props: SheetContentProps) {
  const {
    children,
    className,
    closeLabel = 'Close sheet',
    ref,
    side = 'right',
    ...rest
  } = props

  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'border-border bg-surface-elevated text-foreground data-[state=closed]:animate-out data-[state=open]:animate-in fixed inset-y-0 z-50 grid h-dvh w-[min(24rem,calc(100%-2rem))] max-w-none gap-4 overflow-y-auto p-5 pt-[calc(1.25rem+env(safe-area-inset-top))] pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-lg data-[state=closed]:duration-200 data-[state=closed]:ease-in data-[state=open]:duration-300 data-[state=open]:ease-out motion-reduce:animate-none',
          sheetSideClasses[side],
          className
        )}
        {...rest}
      >
        {children}
        <DialogPrimitive.Close
          aria-label={closeLabel}
          className='text-muted-foreground hover:bg-surface-muted hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background absolute top-3 left-3 inline-flex size-11 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
          type='button'
        >
          <span aria-hidden='true'>×</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </SheetPortal>
  )
}

export function SheetHeader(props: ComponentPropsWithoutRef<'div'>) {
  const { className, ...rest } = props

  return (
    <div
      className={cn('flex flex-col gap-2 text-start', className)}
      {...rest}
    />
  )
}

export function SheetFooter(props: ComponentPropsWithoutRef<'div'>) {
  const { className, ...rest } = props

  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className
      )}
      {...rest}
    />
  )
}

export function SheetTitle(
  props: ComponentPropsWithRef<typeof DialogPrimitive.Title>
) {
  const { className, ref, ...rest } = props

  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('text-lg font-semibold', className)}
      {...rest}
    />
  )
}

export function SheetDescription(
  props: ComponentPropsWithRef<typeof DialogPrimitive.Description>
) {
  const { className, ref, ...rest } = props

  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('text-muted-foreground text-sm leading-6', className)}
      {...rest}
    />
  )
}
