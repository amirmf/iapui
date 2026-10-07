import type { ReactNode } from 'react'

import { ConfirmDialog as BaseConfirmDialog } from '@iap/dialogs'

export type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  desc: ReactNode
  confirmText?: ReactNode
  destructive?: boolean
  isLoading?: boolean
  handleConfirm: () => void
  disabled?: boolean
  hideCancelButton?: boolean
  cancelBtnText?: string
  className?: string
  children?: ReactNode
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const {
    open,
    onOpenChange,
    title,
    desc,
    confirmText,
    destructive,
    isLoading,
    handleConfirm,
    disabled,
    hideCancelButton,
    cancelBtnText,
    className,
    children,
  } = props

  return (
    <BaseConfirmDialog
      cancelLabel={cancelBtnText}
      className={className}
      confirmLabel={confirmText}
      confirmVariant={destructive ? 'destructive' : 'default'}
      description={desc}
      disableConfirm={disabled}
      hideCancelButton={hideCancelButton}
      isLoading={isLoading}
      onConfirm={handleConfirm}
      onOpenChange={onOpenChange}
      open={open}
      presentation='reference'
      title={title}
    >
      {children}
    </BaseConfirmDialog>
  )
}
