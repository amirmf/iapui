import {
  type ComponentPropsWithRef,
  type ComponentPropsWithoutRef,
  createContext,
  useContext,
} from 'react'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'

import { cn } from './lib/cn'

const SheetPresentationContext = createContext(false)

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
  props: ComponentPropsWithRef<typeof DialogPrimitive.Overlay> & {
    presentation?: 'default' | 'reference'
  }
) {
  const { className, ref, presentation = 'default', ...rest } = props

  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        presentation === 'reference'
          ? 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50'
          : 'bg-background/80 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50 data-[state=closed]:duration-200 data-[state=open]:duration-300 motion-reduce:animate-none',
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
  presentation?: 'default' | 'reference'
  closeLabel?: string
  side?: SheetSide
}

export function SheetContent(props: SheetContentProps) {
  const {
    children,
    className,
    closeLabel,
    presentation = 'default',
    ref,
    side = 'right',
    ...rest
  } = props

  const isReference = presentation === 'reference'
  return (
    <SheetPresentationContext.Provider value={isReference}>
      <SheetPortal>
        <SheetOverlay presentation={presentation} />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            isReference
              ? 'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed inset-y-0 z-50 flex h-full w-3/4 flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 sm:max-w-sm'
              : 'border-border bg-surface-elevated text-foreground data-[state=closed]:animate-out data-[state=open]:animate-in fixed inset-y-0 z-50 grid h-dvh w-[min(24rem,calc(100%-2rem))] max-w-none gap-4 overflow-y-auto p-5 pt-[calc(1.25rem+env(safe-area-inset-top))] pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-lg data-[state=closed]:duration-200 data-[state=closed]:ease-in data-[state=open]:duration-300 data-[state=open]:ease-out motion-reduce:animate-none',
            sheetSideClasses[side],
            className
          )}
          {...rest}
        >
          {children}
          <DialogPrimitive.Close
            aria-label={closeLabel ?? (isReference ? 'Close' : 'Close sheet')}
            className={
              isReference
                ? 'ring-offset-background data-[state=open]:bg-secondary absolute top-4 left-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none'
                : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background absolute top-3 left-3 inline-flex size-11 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
            }
            type='button'
          >
            {isReference ? (
              <XIcon aria-hidden='true' className='size-4' />
            ) : (
              <span aria-hidden='true'>×</span>
            )}
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </SheetPortal>
    </SheetPresentationContext.Provider>
  )
}

export function SheetHeader(props: ComponentPropsWithoutRef<'div'>) {
  const { className, ...rest } = props
  const isReference = useContext(SheetPresentationContext)

  return (
    <div
      className={cn(
        isReference
          ? 'flex flex-col gap-1.5 p-4'
          : 'flex flex-col gap-2 text-start',
        className
      )}
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
  const isReference = useContext(SheetPresentationContext)

  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn(
        isReference ? 'text-foreground font-semibold' : 'text-lg font-semibold',
        className
      )}
      {...rest}
    />
  )
}

export function SheetDescription(
  props: ComponentPropsWithRef<typeof DialogPrimitive.Description>
) {
  const { className, ref, ...rest } = props
  const isReference = useContext(SheetPresentationContext)

  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn(
        isReference
          ? 'text-muted-foreground text-sm'
          : 'text-muted-foreground text-sm leading-6',
        className
      )}
      {...rest}
    />
  )
}
