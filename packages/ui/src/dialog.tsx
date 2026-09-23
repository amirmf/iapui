import {
  type ComponentPropsWithRef,
  type ComponentPropsWithoutRef,
} from 'react'

import * as DialogPrimitive from '@radix-ui/react-dialog'

import { cn } from './lib/cn'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export const DialogPortal = DialogPrimitive.Portal

export function DialogOverlay(
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

export type DialogContentProps = ComponentPropsWithRef<
  typeof DialogPrimitive.Content
> & {
  closeLabel?: string
}

export function DialogContent(props: DialogContentProps) {
  const { children, className, closeLabel = 'Close', ref, ...rest } = props
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'border-border bg-surface-elevated text-foreground data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border p-5 shadow-lg data-[state=closed]:duration-200 data-[state=closed]:ease-in data-[state=open]:duration-300 data-[state=open]:ease-out motion-reduce:animate-none',
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
    </DialogPortal>
  )
}

export function DialogHeader(props: ComponentPropsWithoutRef<'div'>) {
  const { className, ...rest } = props
  return (
    <div
      className={cn('flex flex-col gap-2 text-start', className)}
      {...rest}
    />
  )
}

export function DialogFooter(props: ComponentPropsWithoutRef<'div'>) {
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

export function DialogTitle(
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

export function DialogDescription(
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
