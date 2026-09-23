import {
  type ComponentPropsWithRef,
  type ComponentPropsWithoutRef,
} from 'react'

import * as DialogPrimitive from '@radix-ui/react-dialog'

import { cn } from './lib/cn'

export const BottomSheet = DialogPrimitive.Root
export const BottomSheetTrigger = DialogPrimitive.Trigger
export const BottomSheetClose = DialogPrimitive.Close
export const BottomSheetPortal = DialogPrimitive.Portal

export function BottomSheetOverlay(
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

export type BottomSheetContentProps = ComponentPropsWithRef<
  typeof DialogPrimitive.Content
> & {
  closeLabel?: string
  showHandle?: boolean
}

export function BottomSheetContent(props: BottomSheetContentProps) {
  const {
    children,
    className,
    closeLabel = 'Close bottom sheet',
    ref,
    showHandle = true,
    ...rest
  } = props

  return (
    <BottomSheetPortal>
      <BottomSheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'border-border bg-surface-elevated text-foreground data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom fixed inset-x-0 bottom-0 z-50 grid max-h-[min(85dvh,48rem)] w-full gap-4 overflow-y-auto rounded-t-2xl border-x border-t px-5 pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-lg data-[state=closed]:duration-200 data-[state=closed]:ease-in data-[state=open]:duration-300 data-[state=open]:ease-out motion-reduce:animate-none sm:inset-x-4 sm:w-auto sm:rounded-t-xl',
          className
        )}
        {...rest}
      >
        {showHandle ? (
          <div
            aria-hidden='true'
            className='bg-border mx-auto h-1 w-10 shrink-0 rounded-full'
          />
        ) : null}
        {children}
        <DialogPrimitive.Close
          aria-label={closeLabel}
          className='text-muted-foreground hover:bg-surface-muted hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background absolute top-3 left-3 inline-flex size-11 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
          type='button'
        >
          <span aria-hidden='true'>×</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </BottomSheetPortal>
  )
}

export function BottomSheetHeader(props: ComponentPropsWithoutRef<'div'>) {
  const { className, ...rest } = props
  return (
    <div
      className={cn('flex flex-col gap-2 text-start', className)}
      {...rest}
    />
  )
}

export function BottomSheetFooter(props: ComponentPropsWithoutRef<'div'>) {
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

export function BottomSheetTitle(
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

export function BottomSheetDescription(
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
