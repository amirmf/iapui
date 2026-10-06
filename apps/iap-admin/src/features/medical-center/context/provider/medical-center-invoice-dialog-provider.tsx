import { type ReactNode, useEffect } from 'react'

import { useMedicalCenterInvoiceDialog } from '@features/medical-center/context/store/medical-center-invoice-dialog-store'

export function MedicalCenterInvoiceDialogProvider(props: {
  children: ReactNode
}) {
  const { children } = props
  const reset = useMedicalCenterInvoiceDialog((state) => state.reset)
  useEffect(() => () => reset(), [reset])
  return <>{children}</>
}
