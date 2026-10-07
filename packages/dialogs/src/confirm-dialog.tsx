import type { ReactNode } from 'react'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  cn,
} from '@iap/ui'
import {
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

export type ConfirmDialogVariant =
  'default' | 'error' | 'warning' | 'success' | 'info'

export type ConfirmDialogProps = {
  cancelLabel?: ReactNode
  children?: ReactNode
  className?: string
  confirmLabel?: ReactNode
  confirmVariant?: 'default' | 'destructive'
  description: ReactNode
  disableConfirm?: boolean
  hideCancelButton?: boolean
  isLoading?: boolean
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
  open: boolean
  title: ReactNode
  variant?: ConfirmDialogVariant
  presentation?: 'default' | 'reference'
}

const statusIcons = {
  error: CircleXIcon,
  warning: TriangleAlertIcon,
  success: CircleCheckIcon,
  info: InfoIcon,
} as const

const statusIconClasses: Record<
  Exclude<ConfirmDialogVariant, 'default'>,
  string
> = {
  error: 'bg-destructive/10 text-destructive',
  warning: 'bg-warning/10 text-warning',
  success: 'bg-success/10 text-success',
  info: 'bg-info/10 text-info',
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const {
    cancelLabel,
    children,
    className,
    confirmLabel,
    confirmVariant,
    description,
    disableConfirm = false,
    hideCancelButton = false,
    isLoading = false,
    onConfirm,
    onOpenChange,
    open,
    presentation = 'default',
    title,
    variant = 'default',
  } = props
  const { t } = useTranslation()
  const statusVariant = variant === 'default' ? null : variant
  const StatusIcon = statusVariant ? statusIcons[statusVariant] : null
  const isReference = presentation === 'reference'

  const handleOpenChange = (nextOpen: boolean) => {
    if (isReference || !isLoading) onOpenChange(nextOpen)
  }

  return (
    <AlertDialog onOpenChange={handleOpenChange} open={open}>
      <AlertDialogContent className={className} presentation={presentation}>
        <AlertDialogHeader className={cn(isReference && 'text-left')}>
          {isReference ? (
            <>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div>{description}</div>
              </AlertDialogDescription>
            </>
          ) : (
            <div className='flex items-start gap-3'>
              {StatusIcon ? (
                <div
                  aria-hidden='true'
                  className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-full',
                    statusVariant ? statusIconClasses[statusVariant] : undefined
                  )}
                >
                  <StatusIcon aria-hidden='true' className='size-6' />
                </div>
              ) : null}
              <div className='min-w-0 flex-1 space-y-2'>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div>{description}</div>
                </AlertDialogDescription>
              </div>
            </div>
          )}
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          {!hideCancelButton ? (
            <AlertDialogCancel disabled={isLoading}>
              {cancelLabel ?? t('common.dialog.cancel')}
            </AlertDialogCancel>
          ) : null}
          <Button
            presentation={presentation}
            disabled={disableConfirm || isLoading}
            onClick={onConfirm}
            type='button'
            variant={
              confirmVariant ??
              (variant === 'error' ? 'destructive' : 'default')
            }
          >
            {confirmLabel ?? t('common.dialog.confirm')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export type VariantConfirmDialogProps = ConfirmDialogProps

export function VariantConfirmDialog(props: VariantConfirmDialogProps) {
  return <ConfirmDialog {...props} />
}
