import {
  type ComponentPropsWithRef,
  type ComponentPropsWithoutRef,
  createContext,
  useContext,
} from 'react'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'

import { cn } from './lib/cn'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export const DialogPortal = DialogPrimitive.Portal
const DialogPresentation = createContext<'default' | 'reference'>('default')

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
  showCloseButton?: boolean
  presentation?: 'default' | 'reference'
}

export function DialogContent(props: DialogContentProps) {
  const {
    children,
    className,
    closeLabel = 'Close',
    ref,
    showCloseButton = true,
    presentation = 'default',
    ...rest
  } = props
  return (
    <DialogPresentation.Provider value={presentation}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            presentation === 'default' &&
              'border-border bg-surface-elevated text-foreground data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border p-5 shadow-lg data-[state=closed]:duration-200 data-[state=closed]:ease-in data-[state=open]:duration-300 data-[state=open]:ease-out motion-reduce:animate-none',
            presentation === 'reference' &&
              'bg-dialog-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-50 grid max-h-[95vh] w-full max-w-[calc(100%-2rem)] origin-center translate-x-[-50%] translate-y-[-50%] transform-gpu gap-4 overflow-auto rounded-lg border p-6 shadow-lg duration-200 motion-reduce:animate-none sm:max-w-lg',
            className
          )}
          {...rest}
        >
          {children}
          {showCloseButton ? (
            <DialogPrimitive.Close
              aria-label={closeLabel}
              className={cn(
                'text-muted-foreground hover:bg-surface-muted hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background absolute top-3 left-3 inline-flex size-11 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                presentation === 'reference' &&
                  'top-4 left-auto size-auto rounded-sm opacity-70 hover:opacity-100 ltr:right-4 rtl:left-4'
              )}
              type='button'
            >
              {presentation === 'reference' ? (
                <Cross2Icon aria-hidden='true' className='size-4' />
              ) : (
                <span aria-hidden='true'>×</span>
              )}
            </DialogPrimitive.Close>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogPresentation.Provider>
  )
}

export function DialogHeader(props: ComponentPropsWithoutRef<'div'>) {
  const { className, ...rest } = props
  const presentation = useContext(DialogPresentation)
  return (
    <div
      className={cn(
        'flex flex-col gap-2 text-start',
        presentation === 'reference' && 'text-center sm:text-left',
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
  props: ComponentPropsWithRef<typeof DialogPrimitive.Title>
) {
  const { className, ref, ...rest } = props
  const presentation = useContext(DialogPresentation)
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn(
        'text-lg font-semibold',
        presentation === 'reference' &&
          'leading-none ltr:text-left rtl:text-right',
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
  const presentation = useContext(DialogPresentation)
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn(
        'text-muted-foreground text-sm',
        presentation === 'default' && 'leading-6',
        presentation === 'reference' && 'ltr:text-left rtl:text-right',
        className
      )}
      {...rest}
    />
  )
}
