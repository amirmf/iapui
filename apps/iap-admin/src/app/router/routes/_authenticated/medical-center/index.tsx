import { MedicalCenterInvoicesPage } from '@features/medical-center'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/medical-center/')({
  component: MedicalCenterInvoicesPage,
  loader: () => ({ crumb: 'medical-center' }),
})
