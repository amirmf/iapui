import { type CSSProperties, createElement, useSyncExternalStore } from 'react'

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from 'lucide-react'
import {
  Toaster as SonnerToaster,
  type ToasterProps as SonnerToasterProps,
  toast,
} from 'sonner'

import { cn } from './lib/cn'

export type ToasterProps = SonnerToasterProps

type DocumentTheme = 'dark' | 'light'

function getDocumentTheme(): DocumentTheme {
  if (typeof document === 'undefined') {
    return 'light'
  }

  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function subscribeToDocumentTheme(onThemeChange: () => void) {
  if (typeof document === 'undefined') {
    return () => undefined
  }

  const observer = new MutationObserver(onThemeChange)
  observer.observe(document.documentElement, {
    attributeFilter: ['class'],
    attributes: true,
  })

  return () => observer.disconnect()
}

export function Toaster(props: ToasterProps) {
  const { className, dir = 'auto', style, theme, ...rest } = props
  const documentTheme = useSyncExternalStore<DocumentTheme>(
    subscribeToDocumentTheme,
    getDocumentTheme,
    () => 'light'
  )

  return (
    <SonnerToaster
      className={cn('font-sans [&_div[data-content]]:w-full', className)}
      closeButton
      dir={dir}
      icons={{
        error: <OctagonXIcon className='size-5' />,
        info: <InfoIcon className='size-5' />,
        loading: <Loader2Icon className='size-5 animate-spin' />,
        success: <CircleCheckIcon className='size-5' />,
        warning: <TriangleAlertIcon className='size-5' />,
      }}
      richColors
      style={
        {
          '--normal-bg': 'rgb(var(--color-popover))',
          '--normal-border': 'rgb(var(--color-border))',
          '--normal-text': 'rgb(var(--color-popover-foreground))',
          fontFamily: 'Vazirmatn, sans-serif',
          ...style,
        } as CSSProperties
      }
      theme={theme ?? documentTheme}
      {...rest}
    />
  )
}

type ErrorToastProps = {
  message?: string | null
  toastId: number | string
}

function ErrorToast(props: ErrorToastProps) {
  const { message, toastId } = props

  return (
    <div className='flex w-full flex-col gap-1.5'>
      <div className='flex w-full items-start gap-1.5'>
        <OctagonXIcon aria-hidden='true' className='size-5 shrink-0' />
        <p className='min-w-0 flex-1 leading-6 font-medium break-words whitespace-pre-line'>
          {message}
        </p>
      </div>
      <button
        aria-label='بستن پیام'
        className='focus-visible:ring-ring absolute -top-3 flex size-6 items-center justify-center rounded-full border border-[var(--error-border)] bg-[var(--error-bg)] text-[var(--error-text)] transition-colors hover:brightness-95 focus-visible:ring-2 focus-visible:outline-none ltr:-left-2 rtl:-right-2'
        onClick={() => toast.dismiss(toastId)}
        type='button'
      >
        <XIcon aria-hidden='true' className='size-4' />
      </button>
    </div>
  )
}

export type ToastErrorOptions = {
  duration?: number
  message?: string | null
}

export function toastError(props: ToastErrorOptions) {
  const { duration, message } = props

  return toast.custom(
    (toastId) => createElement(ErrorToast, { message, toastId }),
    {
      className:
        'relative flex w-[var(--width)] items-start rounded-[var(--border-radius)] border border-[var(--error-border)] bg-[var(--error-bg)] p-4 text-[13px] text-[var(--error-text)] shadow-[0_4px_12px_rgba(0,0,0,0.1)]',
      duration,
    }
  )
}
