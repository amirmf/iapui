import {
  type ComponentPropsWithRef,
  type ComponentPropsWithoutRef,
} from 'react'

import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

import { buttonVariants } from './button'
import { cn } from './lib/cn'

export const AlertDialog = AlertDialogPrimitive.Root
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger
export const AlertDialogPortal = AlertDialogPrimitive.Portal

export function AlertDialogOverlay(
  props: ComponentPropsWithRef<typeof AlertDialogPrimitive.Overlay> & {
    presentation?: 'default' | 'reference'
  }
) {
  const { className, presentation = 'default', ref, ...rest } = props
  return (
    <AlertDialogPrimitive.Overlay
      data-slot='alert-dialog-overlay'
      ref={ref}
      className={cn(
        presentation === 'reference' &&
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        presentation !== 'reference' &&
          'bg-background/80 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50 data-[state=closed]:duration-200 data-[state=open]:duration-300 motion-reduce:animate-none',
        className
      )}
      {...rest}
    />
  )
}

export function AlertDialogContent(
  props: ComponentPropsWithRef<typeof AlertDialogPrimitive.Content> & {
    presentation?: 'default' | 'reference'
  }
) {
  const { className, presentation = 'default', ref, ...rest } = props
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay presentation={presentation} />
      <AlertDialogPrimitive.Content
        data-slot='alert-dialog-content'
        ref={ref}
        className={cn(
          presentation === 'reference' &&
            'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] origin-center translate-x-[-50%] translate-y-[-50%] transform-gpu gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
          presentation !== 'reference' &&
            'border-border bg-surface-elevated text-foreground data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border p-5 shadow-lg data-[state=closed]:duration-200 data-[state=closed]:ease-in data-[state=open]:duration-300 data-[state=open]:ease-out motion-reduce:animate-none',
          className
        )}
        {...rest}
      />
    </AlertDialogPortal>
  )
}

export function AlertDialogHeader(props: ComponentPropsWithoutRef<'div'>) {
  const { className, ...rest } = props
  return (
    <div
      className={cn('flex flex-col gap-2 text-start', className)}
      {...rest}
    />
  )
}

export function AlertDialogFooter(props: ComponentPropsWithoutRef<'div'>) {
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

export const AlertDialogTitle = AlertDialogPrimitive.Title
export const AlertDialogDescription = AlertDialogPrimitive.Description

export function AlertDialogAction(
  props: ComponentPropsWithRef<typeof AlertDialogPrimitive.Action>
) {
  const { className, ref, ...rest } = props
  return (
    <AlertDialogPrimitive.Action
      ref={ref}
      className={cn(buttonVariants(), className)}
      {...rest}
    />
  )
}

export function AlertDialogCancel(
  props: ComponentPropsWithRef<typeof AlertDialogPrimitive.Cancel>
) {
  const { className, ref, ...rest } = props
  return (
    <AlertDialogPrimitive.Cancel
      ref={ref}
      className={cn(buttonVariants({ variant: 'outline' }), className)}
      {...rest}
    />
  )
}
