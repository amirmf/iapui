import {
  type ComponentPropsWithRef,
  type ComponentPropsWithoutRef,
} from 'react'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { cn } from './lib/cn'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export const DialogPortal = DialogPrimitive.Portal

type DialogPresentation = 'default' | 'reference'

export function DialogOverlay(
  props: ComponentPropsWithRef<typeof DialogPrimitive.Overlay> & {
    presentation?: DialogPresentation
  }
) {
  const { className, presentation = 'default', ref, ...rest } = props
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      data-slot='dialog-overlay'
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

export type DialogContentProps = ComponentPropsWithRef<
  typeof DialogPrimitive.Content
> & {
  closeLabel?: string
  presentation?: DialogPresentation
  showCloseButton?: boolean
}

export function DialogContent(props: DialogContentProps) {
  const {
    children,
    className,
    closeLabel = 'Close',
    presentation = 'default',
    ref,
    showCloseButton = true,
    ...rest
  } = props
  return (
    <DialogPortal>
      <DialogOverlay presentation={presentation} />
      <DialogPrimitive.Content
        ref={ref}
        data-slot='dialog-content'
        className={cn(
          presentation === 'reference' &&
            'bg-dialog-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-50 grid max-h-[95vh] w-full max-w-[calc(100%-2rem)] origin-center translate-x-[-50%] translate-y-[-50%] transform-gpu gap-4 overflow-auto rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
          presentation !== 'reference' &&
            'border-border bg-surface-elevated text-foreground data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border p-5 shadow-lg data-[state=closed]:duration-200 data-[state=closed]:ease-in data-[state=open]:duration-300 data-[state=open]:ease-out motion-reduce:animate-none',
          className
        )}
        {...rest}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close
            aria-label={closeLabel}
            data-slot='dialog-close'
            className={cn(
              presentation === 'reference' &&
                "data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none ltr:right-4 rtl:left-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              presentation !== 'reference' &&
                'text-muted-foreground hover:bg-surface-muted hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background absolute top-3 left-3 inline-flex size-11 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
            )}
            type='button'
          >
            {presentation === 'reference' ? (
              <>
                <X aria-hidden='true' />
                <span className='sr-only'>{closeLabel}</span>
              </>
            ) : (
              <span aria-hidden='true'>×</span>
            )}
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

export function DialogHeader(
  props: ComponentPropsWithoutRef<'div'> & { presentation?: DialogPresentation }
) {
  const { className, presentation = 'default', ...rest } = props
  return (
    <div
      data-slot='dialog-header'
      className={cn(
        presentation === 'reference' &&
          'flex flex-col gap-2 text-center sm:text-left',
        presentation !== 'reference' && 'flex flex-col gap-2 text-start',
        className
      )}
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
  props: ComponentPropsWithRef<typeof DialogPrimitive.Title> & {
    presentation?: DialogPresentation
  }
) {
  const { className, presentation = 'default', ref, ...rest } = props
  return (
    <DialogPrimitive.Title
      ref={ref}
      data-slot='dialog-title'
      className={cn(
        presentation === 'reference' &&
          'text-lg leading-none font-semibold ltr:text-left rtl:text-right',
        presentation !== 'reference' && 'text-lg font-semibold',
        className
      )}
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
